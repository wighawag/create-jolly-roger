# create-jolly-roger

Scaffold a full-stack onchain app from the [Jolly-Roger](https://github.com/wighawag/jolly-roger) template — SvelteKit 5, Hardhat v3, and the Rocketh deployment system.

## Quick start

```bash
pnpm create jolly-roger
```

Or with a specific project name:

```bash
pnpm create jolly-roger my-awesome-app
```

This fetches the latest template from `jolly-roger` main, substitutes your project name everywhere, initializes git, and leaves you ready to:

```bash
cd my-awesome-app
pnpm i
pnpm start
```

## How it works

The CLI fetches the [jolly-roger](https://github.com/wighawag/jolly-roger) repo's `main` branch at runtime using [`degit`](https://github.com/Rich-Harris/degit) — no bundled template, always up to date. It then substitutes the project name in:

- Package names (`jolly-roger`, `jolly-roger-web`, `jolly-roger-contracts`)
- Display names (`Jolly Roger` → title case)
- E2E test regexes

You can also just `git clone` jolly-roger directly — this package is just a convenience that renames everything for you.

## License

AGPL-3.0-only