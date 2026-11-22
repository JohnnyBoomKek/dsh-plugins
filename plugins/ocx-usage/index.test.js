import test from 'node:test';
import assert from 'node:assert/strict';
import { apply } from './index.js';

test('tool and carrier expose the same sanitized failure when OCX is missing', async () => {
  let route, tool;
  apply({
    tools: { register(value) { tool = value; } },
    connection: { fetch: { register(value) { route = value; return () => {}; } } },
    effect(fn) { return fn(); },
  }, { ocxPath: '/dev/null/ocx' });
  assert.equal(route.path, '/api/ocx-usage/snapshot');
  assert.deepEqual(route.methods, ['GET']);
  const reply = await route.fetch();
  assert.equal(reply.headers.get('cache-control'), 'no-store');
  assert.deepEqual(await reply.json(), await tool.execute());
});
