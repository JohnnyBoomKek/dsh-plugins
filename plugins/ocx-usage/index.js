import { accessSync, constants, readdirSync } from 'node:fs';
import { homedir } from 'node:os';
import { isAbsolute, join } from 'node:path';
import { createReader } from './metrics.js';

export const inject = ['tools', 'connection'];
const route = '/api/ocx-usage/snapshot';

function resolveOcx(config) {
  const root = join(homedir(), '.nvm', 'versions', 'node');
  let versions = [];
  try { versions = readdirSync(root).filter(v => /^v\d+\.\d+\.\d+$/.test(v)).sort((a,b) => b.localeCompare(a, 'en', { numeric: true })); } catch {}
  const candidates = config?.ocxPath ? [config.ocxPath] : [
    ...(process.env.PATH ?? '').split(':').filter(isAbsolute).map(p => join(p, 'ocx')),
    ...versions.map(v => join(root, v, 'bin', 'ocx')),
    '/opt/homebrew/bin/ocx', '/usr/local/bin/ocx',
  ];
  for (const path of candidates) {
    if (typeof path !== 'string' || !isAbsolute(path)) continue;
    try { accessSync(path, constants.X_OK); return path; } catch {}
  }
  return null;
}

export function apply(ctx, config) {
  const executable = resolveOcx(config);
  const lifecycle = new AbortController();
  ctx.effect(() => () => lifecycle.abort(), 'OCX subprocess lifecycle');
  const read = executable ? createReader({ executable, signal: lifecycle.signal }) : async () => {
    const message = 'OpenCodex executable not found. Configure the absolute ocxPath.';
    return { usage: { today: null, last7Days: null }, quota: null, errors: { today: message, last7Days: message, quota: message } };
  };
  ctx.tools.register({
    name: 'ocx_usage',
    description: 'Read sanitized OpenCodex token totals and quota observations. No model calls or account changes. Results cache for 60 seconds; quota observations may query providers.',
    parameters: { type: 'object', properties: {}, additionalProperties: false },
    output: { schema: { type: 'object', properties: {}, additionalProperties: true }, render: (_args, value) => [{ type: 'text', text: JSON.stringify(value) }] },
    execute: read,
  });
  ctx.effect(() => ctx.connection.fetch.register({
    path: route,
    methods: ['GET'],
    requestBody: 'buffered',
    async fetch() {
      return Response.json(await read(), { headers: { 'cache-control': 'no-store' } });
    },
  }), 'OCX usage snapshot route');
}
