import test from 'node:test';
import assert from 'node:assert/strict';
import { createReader, quotaReport, usageReport } from './metrics.js';

test('only public aggregate fields survive normalization', () => {
  const report = usageReport({ summary: { totalTokens: 0, email: 'private' }, models: [], historyTruncated: true });
  assert.equal(report.summary.totalTokens, 0);
  assert.equal(report.summary.inputTokens, null);
  assert.equal(report.historyTruncated, true);
  assert.ok(!JSON.stringify(report).includes('private'));
});

test('quota preserves zero and unavailable; strips account identifiers', () => {
  const report = quotaReport({ accounts: [{ email: 'private', id: 'hidden', active: true, provider: 'test', quota: { shortPercent: 0, shortResetAt: 1795000000, weeklyPercent: 110 } }, { provider: 'test' }] });
  assert.deepEqual(report.accounts[0].windows[0], { label: 'Short window', percentUsed: 0, resetAt: 1795000000000 });
  assert.equal(report.accounts[0].windows[1].percentUsed, null);
  assert.deepEqual(report.accounts[1].windows, []);
  assert.equal(report.accounts[1].label, 'Account 2');
  assert.equal(report.accounts[0].active, true);
  assert.equal(report.accounts[0].plan, null);
  assert.equal(report.accounts[1].active, false);
  assert.doesNotMatch(JSON.stringify(report), /private|hidden/);
});

test('concurrent fetches share work, throttle provider probes, and isolate failures', async () => {
  let now = 0, calls = 0;
  const read = createReader({ now: () => now, run: async args => {
    calls++;
    if (args[0] === 'account') throw new Error('private error');
    return { summary: { totalTokens: 12 }, models: [] };
  } });
  const [a, b] = await Promise.all([read(), read()]);
  assert.equal(a, b);
  assert.equal(calls, 3);
  assert.equal(a.usage.today.summary.totalTokens, 12);
  assert.equal(a.quota, null);
  assert.ok(a.errors.quota);
  assert.doesNotMatch(JSON.stringify(a), /private error/);
  await read();
  assert.equal(calls, 3);
  now = 60_001;
  await read();
  assert.equal(calls, 6);
});

test('a window whose reset already passed re-observes with --refresh', async () => {
  const now = 2_000_000_000_000;
  const calls = [];
  const read = createReader({ now: () => now, run: async args => {
    calls.push(args.join(' '));
    if (args[0] === 'account') {
      const refreshed = args.includes('--refresh');
      return { accounts: [{ provider: 'openai', active: true, quota: {
        shortPercent: refreshed ? 12 : 0,
        shortResetAt: refreshed ? now / 1000 + 9_000 : now / 1000 - 60,
      } }] };
    }
    return { summary: {}, models: [] };
  } });
  const snapshot = await read();
  assert.deepEqual(calls.filter(c => c.startsWith('account')), [
    'account list --quota --json',
    'account list --quota --refresh --json',
  ]);
  assert.equal(snapshot.quota.accounts[0].windows[0].percentUsed, 12);
});

test('force skips the local cache and asks OCX to re-observe', async () => {
  let now = 1_000, calls = 0;
  const read = createReader({ now: () => now, run: async args => {
    if (args[0] === 'account') { calls++; return { accounts: [] } }
    return { summary: {}, models: [] };
  } });
  await read();
  assert.equal(calls, 1, 'first read observes once');
  await read();
  assert.equal(calls, 1, 'cached read does not observe again');
  await read({ force: true });
  assert.equal(calls, 2, 'forced read observes again');
});
