import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
const exec = promisify(execFile);
const number = v => typeof v === 'number' && Number.isFinite(v) && v >= 0 ? v : null;
const timestamp = v => { const n = number(v); return n ? (n < 1e12 ? n * 1000 : n) : null; };
const text = (v, fallback) => typeof v === 'string' && v.trim() ? v.trim().slice(0, 100) : fallback;
const fields = ['inputTokens', 'outputTokens', 'totalTokens', 'cachedInputTokens', 'cacheReadInputTokens', 'cacheCreationInputTokens', 'requests', 'reportedRequests', 'measuredRequests', 'coverageRatio'];
const counts = v => Object.fromEntries(fields.map(k => [k, number(v?.[k])]));
export function usageReport(raw) {
  if (!raw?.summary || !Array.isArray(raw.models)) throw new Error('Missing usage fields');
  return { summary: counts(raw.summary), models: raw.models.slice(0, 100).map(m => ({ ...counts(m), model: text(m.model, 'Unknown model'), provider: text(m.provider, 'Unknown provider') })), generatedAt: timestamp(raw.generatedAt), historyTruncated: !!(raw.historyTruncated || raw.entriesTruncated) };
}
export function quotaReport(raw, fetchedAt = Date.now()) {
  if (!Array.isArray(raw?.accounts)) throw new Error('Missing quota fields');
  const ordinal = new Map();
  return { fetchedAt, accounts: raw.accounts.slice(0, 200).map(a => {
    const provider = text(a.provider, 'Unknown provider');
    const count = (ordinal.get(provider) ?? 0) + 1;
    ordinal.set(provider, count);
    const q = a.quota ?? {};
    const window = (label, p, reset) => ({ label, percentUsed: number(p) !== null && p <= 100 ? p : null, resetAt: timestamp(reset) });
    const windows = [];
    if (q.shortPercent != null || q.shortResetAt != null) windows.push(window(q.shortWindowSeconds ? `${q.shortWindowSeconds / 3600}h` : 'Short window', q.shortPercent, q.shortResetAt));
    if (q.weeklyPercent != null || q.weeklyResetAt != null) windows.push(window('Weekly', q.weeklyPercent, q.weeklyResetAt));
    if (Array.isArray(q.customWindows)) for (const w of q.customWindows.slice(0, 20)) if (w && typeof w === 'object') windows.push(window(text(w.label, 'Custom window'), w.percent, w.resetAt));
    return { provider, label: `Account ${count}`, active: a.active === true, plan: text(a.plan, null), windows, observedAt: timestamp(q.updatedAt) };
  }) };
}
export function createReader({ executable, signal, run = async args => {
  const { stdout } = await exec(executable, args, { signal, timeout: 12_000, maxBuffer: 8 * 1024 * 1024, env: { ...process.env, PATH: `${executable.slice(0, executable.lastIndexOf('/'))}:${process.env.PATH ?? '/usr/bin:/bin'}` } });
  return JSON.parse(stdout);
}, now = Date.now, cooldownMs = 60_000 } = {}) {
  let pending, cached, completedAt;
  /** True when OCX's cached observation predates a window's own reset. */
  const expiresBeforeNow = quota => (quota?.accounts ?? []).some(account =>
    (account.windows ?? []).some(w => w.resetAt !== null && w.resetAt <= now()));
  return function snapshot(options = {}) {
    const force = options?.force === true;
    if (pending) return pending;
    if (!force && cached && now() - completedAt < cooldownMs) return Promise.resolve(cached);
    pending = (async () => {
      const result = { usage: { today: null, last7Days: null }, quota: null, errors: {} };
      const readQuota = async () => {
        if (!force) {
          const cachedReport = quotaReport(await run(['account', 'list', '--quota', '--json']), now());
          if (!expiresBeforeNow(cachedReport)) return cachedReport;
        }
        return quotaReport(await run(['account', 'list', '--quota', '--refresh', '--json']), now());
      };
      await Promise.all([
        ['today', ['usage', '--range', 'today', '--json'], v => { result.usage.today = usageReport(v); }],
        ['last7Days', ['usage', '--range', '7d', '--json'], v => { result.usage.last7Days = usageReport(v); }],
        ['quota', null, null],
      ].map(async ([key, args, apply]) => {
        try {
          if (key === 'quota') result.quota = await readQuota();
          else apply(await run(args));
        } catch { result.errors[key] = 'OpenCodex data unavailable. Check that OCX is running and signed in.'; }
      }));
      cached = result;
      completedAt = now();
      return result;
    })().finally(() => { pending = undefined; });
    return pending;
  };
}
