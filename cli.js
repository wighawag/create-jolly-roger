#!/usr/bin/env node

import {
	existsSync,
	mkdirSync,
	readFileSync,
	writeFileSync,
	cpSync,
	statSync,
	readdirSync,
	rmSync,
} from 'node:fs';
import { join, resolve, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = join(__filename, '..');

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function log(...args) {
	console.log(...args);
}

function error(...args) {
	console.error(...args);
	process.exit(1);
}

/**
 * Replace all occurrences of patterns in a string.
 */
function replaceInText(text, replacements) {
	let result = text;
	for (const [pattern, replacement] of replacements) {
		result = result.split(pattern).join(replacement);
	}
	return result;
}

/**
 * Process a single file: read, replace, write back.
 */
function processFile(filePath, replacements) {
	const content = readFileSync(filePath, 'utf-8');
	const newContent = replaceInText(content, replacements);
	if (newContent !== content) {
		writeFileSync(filePath, newContent, 'utf-8');
		return true;
	}
	return false;
}

// ---------------------------------------------------------------------------
// Name mapping
// ---------------------------------------------------------------------------

function buildReplacements(projectName) {
	// Derive title case: "my-app" -> "My App"
	const titleCase = projectName
		.split('-')
		.map((w) => w.charAt(0).toUpperCase() + w.slice(1))
		.join(' ');

	return [
		// Package names
		['"jolly-roger"', `"${projectName}"`],
		['"jolly-roger-web"', `"${projectName}-web"`],
		['"jolly-roger-contracts"', `"${projectName}-contracts"`],

		// Display names
		['Jolly Roger', titleCase],

		// Contract package imports in README
		['"jolly-roger-contracts/', `"${projectName}-contracts/`],

		// Case-insensitive regex in e2e tests: /jolly roger/i
		// Replace hyphens with spaces, keep lowercase (regex is case-insensitive)
		['/jolly roger/i', `/${projectName.replace(/-/g, ' ')}\/i`],
	];
}

// ---------------------------------------------------------------------------
// Directories / files to skip during processing
// ---------------------------------------------------------------------------

const SKIP_DIRS = new Set([
	'node_modules',
	'.git',
	'.svelte-kit',
	'dist',
	'artifacts',
	'cache',
	'generated',
	'deployments',
	'purgatory.db',
]);

const SKIP_FILES = new Set([
	'pnpm-lock.yaml',
	'package-lock.json',
	'yarn.lock',
	'pnpm-workspace.yaml',
]);

/**
 * Recursively process all files in a directory for name substitution.
 */
function processAllFiles(dir, replacements) {
	for (const entry of readdirSync(dir)) {
		const fullPath = join(dir, entry);
		const st = statSync(fullPath);

		if (st.isDirectory()) {
			if (SKIP_DIRS.has(entry)) continue;
			processAllFiles(fullPath, replacements);
		} else if (st.isFile()) {
			if (SKIP_FILES.has(entry)) continue;
			// Only process text files (heuristic: try to parse as utf-8)
			try {
				const content = readFileSync(fullPath, 'utf-8');
				const newContent = replaceInText(content, replacements);
				if (newContent !== content) {
					writeFileSync(fullPath, newContent, 'utf-8');
				}
			} catch {
				// Binary file, skip
			}
		}
	}
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

async function main() {
	const args = process.argv.slice(2);

	// Parse args: project name can be passed as first positional arg
	let projectName = args[0] || null;
	let targetDir = args[1] || null;

	// If no project name given, ask interactively
	if (!projectName) {
		try {
			const prompts = (await import('prompts')).default;
			const response = await prompts([
				{
					type: 'text',
					name: 'projectName',
					message: 'Project name (kebab-case):',
					initial: 'my-jolly-roger-app',
					validate: (val) =>
						/^[a-z0-9]+(-[a-z0-9]+)*$/.test(val) ||
						'Project name must be kebab-case (e.g. my-awesome-app)',
				},
			]);
			projectName = response.projectName;
		} catch {
			error(
				'Please provide a project name: npx create-jolly-roger <project-name>',
			);
		}
	}

	// Validate project name
	if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(projectName)) {
		error(
			`Invalid project name "${projectName}". Must be kebab-case (e.g. my-awesome-app).`,
		);
	}

	// Determine target directory
	if (targetDir) {
		targetDir = resolve(process.cwd(), targetDir);
	} else {
		targetDir = resolve(process.cwd(), projectName);
	}

	// Check if target already exists
	if (existsSync(targetDir)) {
		error(`Directory "${targetDir}" already exists. Please choose a different name or remove it.`);
	}

	log('');
	log(`Creating a new Jolly-Roger project: ${projectName}`);
	log(`Target: ${relative(process.cwd(), targetDir) || projectName}`);
	log('');

	// -----------------------------------------------------------------------
	// Copy template
	// -----------------------------------------------------------------------
	const templateDir = join(__dirname, 'template');
	if (!existsSync(templateDir)) {
		error(`Template directory not found at ${templateDir}`);
	}

	log('Copying template...');
	mkdirSync(targetDir, { recursive: true });

	function copyTemplateDir(src, dest) {
		mkdirSync(dest, { recursive: true });
		for (const entry of readdirSync(src)) {
			if (SKIP_DIRS.has(entry)) continue;
			const srcPath = join(src, entry);
			const destPath = join(dest, entry);
			const st = statSync(srcPath);
			if (st.isDirectory()) {
				copyTemplateDir(srcPath, destPath);
			} else {
				cpSync(srcPath, destPath, { force: true });
			}
		}
	}

	copyTemplateDir(templateDir, targetDir);

	// -----------------------------------------------------------------------
	// Name substitution
	// -----------------------------------------------------------------------
	log('Customizing project name...');
	const replacements = buildReplacements(projectName);
	processAllFiles(targetDir, replacements);

	// -----------------------------------------------------------------------
	// Initialize git
	// -----------------------------------------------------------------------
	log('Initializing git repository...');
	try {
		execSync('git init', { cwd: targetDir, stdio: 'pipe' });
		execSync('git add -A', { cwd: targetDir, stdio: 'pipe' });
		execSync(
			'git commit -m "Initial commit from create-jolly-roger" --no-verify',
			{ cwd: targetDir, stdio: 'pipe' },
		);
	} catch {
		log('  (git init skipped - git may not be installed)');
	}

	// -----------------------------------------------------------------------
	// Done
	// -----------------------------------------------------------------------
	log('');
	log('Done! Your new project is ready.');
	log('');
	log(`  cd ${projectName}`);
	log('  pnpm i');
	log('  pnpm start');
	log('');
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
