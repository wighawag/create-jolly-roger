# create-jolly-roger

Scaffold a full-stack onchain app from the [Jolly-Roger](https://github.com/wighawag/jolly-roger) template: SvelteKit 5, Hardhat v3, and the Rocketh deployment system.

## Quick start

```bash
pnpm create jolly-roger@latest
```

Or with a project name:

```bash
pnpm create jolly-roger@latest my-awesome-app
```

Use `@latest`: a globally installed `create-*` package shadows the registry version, so without it you may silently keep running an old copy.

That fetches the template, substitutes your project name everywhere, initializes git, and leaves you ready to:

```bash
cd my-awesome-app
pnpm i
pnpm start
```

## Updating your project later

This is the part a plain `git clone` cannot give you. Months from now, when the template has picked up fixes and improvements, you can merge them into your project:

```bash
npx offshoot check     # is there anything new?
npx offshoot update    # merge it in
```

Your own work is untouched. You only get a conflict where you and the template edited the same lines, and `git merge --abort` backs the whole thing out. Nothing needs to be installed for this: `npx offshoot` is enough.

This works because scaffolding records the exact template commit in `.offshoot.json` and keeps a transformed snapshot of the template on a `template` branch, which updates merge from. See [offshoot](https://github.com/wighawag/offshoot#readme) for the full model.

### Just the code, no update mechanism

If you would rather have a plain repository with no link back to the template:

```bash
pnpm create jolly-roger@latest my-awesome-app -- --eject
```

No `template` branch, no `.offshoot.json`: one commit on one branch.

### Template variants

```bash
pnpm create jolly-roger@latest my-awesome-app -- --ref variant/full
```

Your project then tracks that branch for later updates, not `main`.

Note the `--` separator: `npm`/`pnpm create` forwards positional arguments straight through, but flags need it.

## How it works

This package is a thin wrapper around [offshoot](https://github.com/wighawag/offshoot), which does the work: fetching the template at a pinned commit, and substituting the project name across file contents **and** file and directory names, in every case variant.

```js
import {scaffold} from 'offshoot';
scaffold({template: 'wighawag/jolly-roger', argv: process.argv.slice(2)});
```

`jolly-roger` -> `my-awesome-app` therefore also covers `jollyRoger`, `JollyRoger`, `JOLLY_ROGER`, `Jolly Roger`, `jolly roger`, `jolly_roger` and the rest, wherever they appear.

Before writing anything, offshoot checks that the substitution is reversible, and refuses names that collide with words already in the template rather than quietly producing a broken project. If that happens, pick a different name (or pass `--force` if you are sure).

You can still just `git clone` jolly-roger directly. This package saves you the renaming, and gives you a project that can pull in template improvements later.

## License

AGPL-3.0-only. offshoot itself is MIT.
