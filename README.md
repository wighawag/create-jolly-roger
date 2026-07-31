# create-jolly-roger

Scaffold a full-stack onchain app with [Jolly-Roger](https://github.com/wighawag/jolly-roger) — SvelteKit 5, Hardhat v3, and the Rocketh deployment system.

## Quick start

```bash
pnpm create jolly-roger
```

Or with a specific project name:

```bash
pnpm create jolly-roger my-awesome-app
```

This creates a new directory with your project, runs `git init`, and leaves you ready to:

```bash
cd my-awesome-app
pnpm i
pnpm start
```

## What you get

A monorepo with two packages:

- **`contracts/`** — Solidity contracts, Hardhat v3, Rocketh deploy scripts, Foundry tests, named accounts, proxy deployment, viem integration.
- **`web/`** — SvelteKit 5 frontend with Tailwind CSS 4, shadcn-svelte, PWA setup, IPFS-compatible static adapter, auto-generated contract deployments.

Plus zellij layouts for full local development, attaching to existing deployments, and remote-chain development.

## How it works

`create-jolly-roger` copies the [jolly-roger](https://github.com/wighawag/jolly-roger) template into your project directory and substitutes the project name everywhere it appears (package names, GitHub URLs, IPFS deploy targets, display names).

## License

AGPL-3.0-only
