---
"create-jolly-roger": minor
---

Rebuild on [offshoot](https://github.com/wighawag/offshoot): scaffolded projects can now pull in template improvements later.

The scaffolder was a one-shot degit fetch plus a handful of hardcoded string replacements, and it recorded nothing about where the project came from, so there was no way back to the template. It is now a thin wrapper around `offshoot`, and every project it creates can run `npx offshoot update` to merge later jolly-roger changes through a real `git merge`, keeping its own work intact.

What changes for you:

- **Updates.** `npx offshoot check` and `npx offshoot update`. Nothing to install; your own commits are untouched, and conflicts only occur where you and the template edited the same lines.
- **The exact template commit is recorded** in `.offshoot.json`, instead of floating on `#main`.
- **More complete renaming.** Substitution now covers every case variant (`jollyRoger`, `JOLLY_ROGER`, `Jolly Roger`, ...) in file contents *and* in file and directory names, rather than six hardcoded patterns. It also fixes a spot the old list missed, which left `jolly-roger-e2e-node.log` in `scripts/run-e2e-tests.sh` of every generated project.
- **Binary files are no longer corrupted.** The old binary guard never actually triggered, so any binary containing the token was silently mangled.
- **A name that collides with the template is now refused** with an explanation, instead of producing a subtly broken project. Override with `--force`.
- **`--eject`** scaffolds a plain repository with no link to the template, for people who just want the code.
- **`--ref <branch|tag|commit>`** scaffolds from a template variant and tracks it for later updates.
- **The suggested project name is still `my-onchain-app`** when you are prompted, supplied by this wrapper rather than by the template.

`degit` and `prompts` are replaced by a single `offshoot` dependency.
