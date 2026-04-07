#!/usr/bin/env node

/**
 * sync-to-obsidian.mjs — Sync career-ops tracker to Obsidian vault
 *
 * Reads data/applications.md and creates/updates Obsidian notes with
 * YAML frontmatter in the career vault. Also copies reports.
 *
 * Usage:
 *   node sync-to-obsidian.mjs [--vault-path <path>]
 *
 * Default vault path: ~/OneDrive/Obsidian/career_vault
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync, copyFileSync, readdirSync } from 'fs';
import { join, dirname, basename } from 'path';
import { fileURLToPath } from 'url';
import { homedir } from 'os';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = __dirname;

// Parse args
const args = process.argv.slice(2);
let vaultPath = join(homedir(), 'OneDrive', 'Obsidian', 'career_vault');

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--vault-path' && args[i + 1]) {
    vaultPath = args[i + 1];
    i++;
  }
}

// Directories
const appsDir = join(vaultPath, 'Applications');
const reportsDir = join(vaultPath, 'Reports');
const companiesDir = join(vaultPath, 'Companies');

// Ensure directories exist
[appsDir, reportsDir, companiesDir].forEach(dir => {
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
});

// Parse applications.md
function parseApplications() {
  const trackerPath = join(ROOT, 'data', 'applications.md');
  if (!existsSync(trackerPath)) {
    console.log('No applications.md found. Nothing to sync.');
    return [];
  }

  const content = readFileSync(trackerPath, 'utf-8');
  const lines = content.split('\n');
  const apps = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed.startsWith('|') || trimmed.startsWith('| #') || trimmed.startsWith('|---')) {
      continue;
    }

    const raw = trimmed.replace(/^\|/, '').replace(/\|$/, '');
    const fields = raw.split('|').map(f => f.trim());

    if (fields.length < 8) continue;

    const [num, date, company, role, score, status, pdf, report, ...rest] = fields;

    // Skip header-like rows
    if (num === '#' || num === '---') continue;

    // Extract report path from markdown link
    let reportPath = '';
    const reportMatch = report.match(/\[.*?\]\(([^)]+)\)/);
    if (reportMatch) {
      reportPath = reportMatch[1];
    }

    apps.push({
      num: num.trim(),
      date: date.trim(),
      company: company.trim(),
      role: role.trim(),
      score: score.trim(),
      status: status.trim(),
      pdf: pdf.includes('✅'),
      reportPath: reportPath,
      notes: rest.join(' ').trim(),
    });
  }

  return apps;
}

// Detect if role likely requires clearance
function detectClearance(role, company, notes) {
  const text = `${role} ${company} ${notes}`.toLowerCase();
  const clearanceSignals = [
    'clearance', 'ts/sci', 'top secret', 'secret', 'cleared',
    'dod', 'department of defense', 'nsa', 'cia', 'dia',
    'booz allen', 'leidos', 'saic', 'northrop', 'raytheon',
    'gdit', 'mantech', 'caci', 'peraton', 'anduril', 'palantir',
    'shield ai', 'il4', 'il5', 'govcloud',
  ];
  return clearanceSignals.some(s => text.includes(s));
}

// Detect archetype from role title
function detectArchetype(role) {
  const r = role.toLowerCase();
  if (r.includes('issm') || r.includes('isso') || r.includes('grc') || r.includes('compliance') || r.includes('rmf')) {
    return 'Cleared GRC / Compliance Engineer';
  }
  if (r.includes('cloud security') || r.includes('aws') && r.includes('security')) {
    return 'Cloud Security Engineer (AWS)';
  }
  if (r.includes('ai security') || r.includes('ai governance') || r.includes('ai risk')) {
    return 'AI Security / AI Governance';
  }
  if (r.includes('devsecops') || r.includes('devops') && r.includes('security')) {
    return 'DevSecOps / Compliance Automation';
  }
  if (r.includes('architect') && r.includes('security')) {
    return 'Security Architect';
  }
  if (r.includes('fedramp') || r.includes('assessor') || r.includes('3pao')) {
    return 'FedRAMP Consultant / Assessor';
  }
  return 'Security Professional';
}

// Slugify for filenames
function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60);
}

// Create/update an application note
function syncApplication(app) {
  const companySlug = slugify(app.company);
  const roleSlug = slugify(app.role);
  const filename = `${app.num}-${companySlug}-${roleSlug}.md`;
  const filepath = join(appsDir, filename);

  const clearanceRequired = detectClearance(app.role, app.company, app.notes);
  const archetype = detectArchetype(app.role);

  // Parse score number
  const scoreMatch = app.score.match(/(\d+\.?\d*)/);
  const scoreNum = scoreMatch ? parseFloat(scoreMatch[1]) : 0;

  // Build report link
  let reportLink = '';
  if (app.reportPath) {
    const reportName = basename(app.reportPath, '.md');
    reportLink = `"[[Reports/${reportName}]]"`;
  }

  const frontmatter = [
    '---',
    'type: application',
    `company: "[[Companies/${app.company}]]"`,
    `role: "${app.role}"`,
    `score: ${scoreNum}`,
    `status: "${app.status}"`,
    `date: ${app.date}`,
    app.reportPath ? `report: ${reportLink}` : 'report: ""',
    `pdf: ${app.pdf}`,
    `clearance_required: ${clearanceRequired}`,
    `archetype: "${archetype}"`,
    `tags: []`,
    '---',
  ].join('\n');

  const body = [
    '',
    `# ${app.company} — ${app.role}`,
    '',
    `**Score:** ${app.score}`,
    `**Status:** ${app.status}`,
    `**Archetype:** ${archetype}`,
    `**Clearance Required:** ${clearanceRequired ? 'Yes' : 'No'}`,
    app.notes ? `**Notes:** ${app.notes}` : '',
    '',
    '## Links',
    app.reportPath ? `- Report: [[Reports/${basename(app.reportPath, '.md')}]]` : '',
    `- Company: [[Companies/${app.company}]]`,
  ].filter(Boolean).join('\n');

  writeFileSync(filepath, frontmatter + '\n' + body + '\n', 'utf-8');
  return filename;
}

// Ensure company note exists
function ensureCompanyNote(company) {
  const filename = `${company}.md`;
  const filepath = join(companiesDir, filename);

  if (existsSync(filepath)) return;

  const content = [
    '---',
    'type: company',
    `name: "${company}"`,
    'sector: ""',
    'clearance_work: false',
    'tags: []',
    '---',
    '',
    `# ${company}`,
    '',
    '## Overview',
    '',
    '## Applications',
    '*Backlinks to application notes will appear here automatically.*',
    '',
    '## Research Notes',
    '',
  ].join('\n');

  writeFileSync(filepath, content, 'utf-8');
}

// Copy reports to vault
function syncReports() {
  const srcReports = join(ROOT, 'reports');
  if (!existsSync(srcReports)) return 0;

  const files = readdirSync(srcReports).filter(f => f.endsWith('.md') && f !== '.gitkeep');
  let copied = 0;

  for (const file of files) {
    const src = join(srcReports, file);
    const dest = join(reportsDir, file);
    copyFileSync(src, dest);
    copied++;
  }

  return copied;
}

// Main
function main() {
  console.log(`Syncing career-ops → Obsidian vault`);
  console.log(`  Source: ${ROOT}`);
  console.log(`  Vault:  ${vaultPath}`);
  console.log('');

  const apps = parseApplications();

  if (apps.length === 0) {
    console.log('No applications to sync.');
    return;
  }

  let synced = 0;
  const companies = new Set();

  for (const app of apps) {
    const filename = syncApplication(app);
    companies.add(app.company);
    synced++;
  }

  // Create company notes
  for (const company of companies) {
    ensureCompanyNote(company);
  }

  // Copy reports
  const reportsCopied = syncReports();

  console.log(`✅ Synced ${synced} applications`);
  console.log(`   ${companies.size} companies`);
  console.log(`   ${reportsCopied} reports copied`);
}

main();
