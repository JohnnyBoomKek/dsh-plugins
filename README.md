# DeepSeek Harness plugins

Two local bundles for [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) (DSH).

| Bundle | What it does |
| --- | --- |
| [`plugins/ocx-usage`](plugins/ocx-usage) | Read-only OpenCodex usage: a coloured quota gauge in the sidebar foot, a popover with limits and reset times, and a full breakdown tab. |
| [`plugins/strawberry-latte`](plugins/strawberry-latte) | A warm ivory and blush-pink palette for the Web client, light and dark. |

> The package names keep their `@local/` prefix. They are installed from a directory, not the npm registry; rename them before publishing to npm.

## Requirements

- DSH `0.2.2-rc.5` or newer. Both bundles rely on client slots (`sidebar.footer.action`, `sidebar.right.pane.tab`) and, for the theme, `ctx.theme.overrideTokens`.
- `ocx-usage` additionally needs the OpenCodex CLI (`ocx`) on the machine running the Harness host, signed in to the providers you want to see. It resolves `ocx` from `PATH`, standard NVM installs, and Homebrew; set the row's `ocxPath` to an absolute path if it lives elsewhere.

## Install

Clone, then add each bundle directory through **Plugins → Add plugin**:

```sh
git clone https://github.com/JohnnyBoomKek/dsh-plugins.git
cd dsh-plugins
```

- OCX usage → select `plugins/ocx-usage`
- Strawberry Latte → select `plugins/strawberry-latte`

Both are linked into the profile, so edits in the clone take effect after a page refresh.

To browse them from the **Discover** tab instead, add this index source (enable **Experimental plugins → Custom plugin indexes** first):

```
https://raw.githubusercontent.com/JohnnyBoomKek/dsh-plugins/main/index.json
```

## What `ocx-usage` does and does not do

- Reads `ocx usage --range today|7d --json` and `ocx account list --quota --json`. It never calls a model, switches accounts, or writes to OCX.
- Returns aggregates, numbered accounts (`Account 1`, `Account 2`), plan names, and quota windows. It drops raw account identifiers, e-mails, upstream keys, and prompts.
- Shares in-flight requests and caches results for 60 seconds, because a quota read can probe upstream providers.
- Reports **Unavailable** rather than zero when a value is missing.

The gauge shows the active OpenAI account's 5-hour quota remaining. Colour follows the amount left — success at 50% or more, warning from 20% to 49%, error below 20% — using the host's semantic state tokens rather than fixed colours.

## What `strawberry-latte` does

Overrides about a dozen `--dsw-*` alias tokens through `ctx.theme.overrideTokens`, so it follows the existing Light/Dark/System picker. Disable the bundle to restore the stock palette.

## Development

```sh
node --test plugins/ocx-usage/*.test.js
node --check plugins/ocx-usage/client.js
node --check plugins/strawberry-latte/client.js
```

## Licence

MIT — see [LICENSE](LICENSE).
