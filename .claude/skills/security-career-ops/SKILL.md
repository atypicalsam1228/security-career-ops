---
name: security-career-ops
description: Configure career-ops for cybersecurity/compliance professionals — security archetypes, defense contractor portals, clearance-aware scoring, Firecrawl integration, Obsidian vault sync
user_invocable: true
args: command
---

# security-career-ops — Security Career Search Configuration

## Overview

This skill configures [career-ops](https://github.com/santifer/career-ops) for cybersecurity and compliance professionals. It overlays security-specific archetypes, defense contractor portals, clearance-aware evaluation rules, Firecrawl web scraping integration, and an Obsidian vault for career intelligence.

## Command Routing

| Input | Action |
|-------|--------|
| (empty / no args) | Show help menu |
| `setup` | Full installation: career-ops + security overlay + Obsidian vault |
| `overlay` | Apply security config to existing career-ops installation |
| `vault` | Set up Obsidian career vault only |
| `sync` | Run Obsidian sync (applications.md → vault) |
| `status` | Check installation status |
| `portals` | Show/edit tracked security employers |
| `archetypes` | Show/edit security role archetypes |

---

## Discovery Mode (no arguments)

Show this menu:

```
security-career-ops — Cybersecurity Career Search Kit
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Overlay for career-ops targeting GRC, cloud security, AI security,
DevSecOps, and cleared cybersecurity roles.

Commands:
  /security-career-ops setup       → Full install (career-ops + security config + vault)
  /security-career-ops overlay     → Apply security config to existing career-ops
  /security-career-ops vault       → Set up Obsidian career vault
  /security-career-ops sync        → Sync applications → Obsidian vault
  /security-career-ops status      → Check installation status
  /security-career-ops portals     → View/edit tracked security employers
  /security-career-ops archetypes  → View/edit security role archetypes

Requires: career-ops (https://github.com/santifer/career-ops)
Optional: Firecrawl skill, Obsidian with Dataview plugin
```

---

## `setup` — Full Installation

### Step 1: Check prerequisites

```bash
node --version    # Must be 18+
```

### Step 2: Clone career-ops (if not present)

Check if career-ops exists. Look for it in:
1. Current working directory
2. `../career-ops/`
3. `~/repos/career-ops/`

If not found:
```bash
git clone https://github.com/santifer/career-ops.git
cd career-ops
npm install
npx playwright install chromium
```

### Step 3: Apply security overlay

Run the `overlay` command (see below).

### Step 4: Set up Obsidian vault

Run the `vault` command (see below).

### Step 5: Onboarding

Ask the user for:
1. **Full name and email** — for profile.yml
2. **Security clearance level** — TS/SCI, Top Secret, Secret, or None
3. **Location and timezone**
4. **Target salary range**
5. **Work location preference** — Remote, Hybrid, Any

Then ask for their CV:
- Paste CV text, provide a .docx file path, or describe experience

Fill in `config/profile.yml` and `cv.md` with their answers.

### Step 6: Confirm ready

```
Setup complete! Your security career-ops is configured with:
  ✅ 6 security/compliance archetypes
  ✅ 24 defense/security employers tracked
  ✅ 19 security-focused search queries
  ✅ Clearance-aware evaluation scoring
  ✅ Firecrawl integration (if available)
  ✅ Obsidian career vault (if set up)

Next: paste a job URL or run /career-ops scan
```

---

## `overlay` — Apply Security Config to Existing career-ops

Locate the career-ops installation directory. Then:

### 1. Copy `modes/_profile.md`

Read the security profile template from this skill's `templates/modes/_profile.md`.

If `modes/_profile.md` already exists in career-ops, ask before overwriting:
> "You already have a _profile.md. Want me to replace it with the security version, or merge the security archetypes into your existing file?"

If it doesn't exist or user says replace, copy the template.

If user says merge, read both files and intelligently combine:
- Add security archetypes to the archetype table
- Add security detection signals
- Add clearance-aware evaluation rules
- Add Firecrawl tool overrides section
- Keep any existing user customizations

### 2. Copy `portals.yml`

Read the security portals template from `templates/portals.yml`.

If `portals.yml` already exists, ask:
> "You have an existing portals.yml. Want me to replace it with security employers, or add security employers to your existing list?"

### 3. Copy `sync-to-obsidian.mjs`

Copy `scripts/sync-to-obsidian.mjs` to the career-ops root.

### 4. Update `.gitignore`

Add `.firecrawl/` if not already present.

### 5. Update `config/profile.yml`

If profile.yml exists, update the archetypes section with security roles.
If not, copy from `templates/profile.yml` and run onboarding.

### 6. Fix Windows dashboard (if on Windows)

Check `dashboard/main.go` for the Windows URL-opening bug. If the `"windows"` case is missing from the `runtime.GOOS` switch, add it:

```go
case "windows":
    cmd = exec.Command("cmd", "/c", "start", url)
```

---

## `vault` — Set Up Obsidian Career Vault

### 1. Determine vault location

Ask user or use defaults:
- **With OneDrive**: `~/OneDrive/Obsidian/career_vault/`
- **Without OneDrive**: `~/Obsidian/career_vault/`
- **Custom**: User specifies path

### 2. Create vault structure

```
career_vault/
  .gitignore
  VAULT-INDEX.md
  Templates/
    application-note.md
    company-note.md
  Companies/
  Applications/
  Reports/
  Analytics/
    pipeline-status.md
    score-distribution.md
    archetype-breakdown.md
    clearance-roles.md
  Stories/
```

Copy all files from `templates/obsidian/` to the vault.

### 3. Set up git (optional)

If user wants version control:
- **With OneDrive**: Use bare git repo pattern (`git init --bare` outside OneDrive, `core.worktree` pointing to vault)
- **Without OneDrive**: Regular `git init` inside vault

### 4. Confirm

```
Obsidian career vault created at: {path}

Open it in Obsidian and install the Dataview plugin for analytics queries.
Run /security-career-ops sync after evaluations to populate the vault.
```

---

## `sync` — Run Obsidian Sync

Find the career-ops directory and run:
```bash
node sync-to-obsidian.mjs
```

If `sync-to-obsidian.mjs` doesn't exist, copy it from this skill's `scripts/` directory first.

---

## `status` — Check Installation Status

Check and report:

| Component | Check | Status |
|-----------|-------|--------|
| career-ops | Directory exists, `package.json` present | ✅/❌ |
| Node.js | `node --version` >= 18 | ✅/❌ |
| Playwright | Chromium installed | ✅/❌ |
| Profile | `config/profile.yml` exists | ✅/❌ |
| CV | `cv.md` exists | ✅/❌ |
| Security overlay | `modes/_profile.md` has security archetypes | ✅/❌ |
| Portals | `portals.yml` has security employers | ✅/❌ |
| Obsidian sync | `sync-to-obsidian.mjs` exists | ✅/❌ |
| Obsidian vault | Vault directory exists | ✅/❌ |
| Firecrawl | `/firecrawl` skill available | ✅/❌ |
| Go dashboard | `dashboard/career-dashboard` binary exists | ✅/❌ |
| Version | `node update-system.mjs check` | current/outdated |

---

## `portals` — View/Edit Security Employers

Read `portals.yml` and show a summary:

```
Tracked Security Employers (24)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Federal/Defense (9):
  ✅ Booz Allen Hamilton    ✅ Leidos         ✅ SAIC
  ✅ Northrop Grumman       ✅ RTX            ✅ GDIT
  ✅ ManTech                ✅ CACI           ✅ Peraton

Cloud Security (4):
  ✅ CrowdStrike            ✅ Palo Alto      ✅ Wiz
  ✅ Zscaler

...

Add/remove: just tell me which companies to change.
```

---

## `archetypes` — View/Edit Security Archetypes

Read `modes/_profile.md` and show the archetype table. Allow the user to:
- Add new archetypes
- Modify detection signals
- Change priority/fit levels
- Update proof point mappings
