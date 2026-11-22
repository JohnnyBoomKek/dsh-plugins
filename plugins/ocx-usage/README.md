# OCX usage

Read-only OpenCodex token totals and quota observations for the local Harness host. The panel fetches when opened and on manual refresh; the host shares in-flight requests and caches results for 60 seconds. Quota reads may query upstream providers but do not call models or switch accounts. The plugin returns aggregates, numbered accounts, and available quota windows; it does not return raw account identifiers, credentials, or prompts.

The host resolves `ocx` from its PATH, standard NVM installs, or Homebrew. Set the plugin row's `ocxPath` to an absolute executable path if needed. The `ocx_usage` tool returns the same snapshot as the panel.

A circular gauge sits in the sidebar footer action stack, left-aligned directly above Settings (`sidebar.footer.action`, order -10). It is 44px with a 31px ring in both the wide and collapsed rail widths, tinted with the theme's secondary label colour and showing the shared hover fill.

The ring encodes the active OpenAI account's **5-hour** quota remaining: a thin track with a rounded progress arc that starts at twelve o'clock and shrinks as the window is consumed, around a small rotated square. Only the arc carries colour — `state-success-primary` at 50% or more, `state-warn-primary` from 20% to 49%, and `state-error-primary` below 20%; a neutral ring means the value is unavailable or its window already reset. The arc animates over 320ms when the value changes. The exact percentage lives in the popover and the accessible label, so the icon stays legible at rail size.

Clicking it opens a popover above the icon with the usage source, one row per limit (`5-hour limit … 10% left`, `Weekly limit … 38% left`), and under each row a muted reset line — the absolute local time plus a relative countdown, for example `Resets Nov 22, 2026, 4:58 PM (in 3 hours)`. A window whose reset time has already passed drops both the line and its percentage, so a stale observation never reads as current usage. Hairline rules separate the sections, and a **Manage usage** row opens the full breakdown tab. Other providers with reported limits follow below a rule, and credit-style labels render as `Credits … $5.48 of $50.00`. The gauge hides itself when OCX reports no quota windows, so it reserves no space when OCX is unavailable.

Run the backend tests with `node --test plugins/ocx-usage/*.test.js` from the workspace root.
