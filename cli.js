#!/usr/bin/env node

// A thin wrapper around offshoot, which does all the work: fetching the
// template at a pinned commit, substituting the project name everywhere
// (contents AND file/directory names), and setting up the repository so
// `offshoot update` can merge later template improvements.
//
// Everything template-specific lives in the jolly-roger repo itself, in its
// optional offshoot.config. This file exists only to spare users typing the
// template name, and to print jolly-roger's own next steps.

import {relative} from 'node:path';
import {scaffold} from 'offshoot';

const TEMPLATE = 'wighawag/jolly-roger';

try {
	const result = await scaffold({
		template: TEMPLATE,
		argv: process.argv.slice(2),
		// A suggestion, not an answer: the user is still asked. This lives here
		// rather than in the template so jolly-roger needs no offshoot config.
		defaults: {name: 'my-onchain-app'},
	});

	const where = relative(process.cwd(), result.dir) || '.';
	console.log('');
	console.log(`  cd ${where}`);
	console.log('  pnpm i');
	console.log('  pnpm start');
	console.log('');
} catch (err) {
	// offshoot's errors are already written for humans, so print the message
	// rather than a stack. The uniqueness gate additionally carries a `report`
	// with the offending files and how to proceed; that detail is the whole
	// point of failing loudly, so never swallow it.
	const detail =
		err && typeof err === 'object' && typeof err.report === 'string'
			? err.report
			: err instanceof Error
				? err.message
				: String(err);
	console.error('');
	console.error(detail);
	console.error('');
	process.exit(1);
}
