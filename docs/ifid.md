# Interactive Fiction Identifier (IFID)

## What is an IFID?

An IFID (Interactive Fiction Identifier) is a universally unique identifier assigned to an interactive fiction work. It follows the UUID v4 format (`xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`) and serves as a permanent, globally unique reference for the game.

IFIDs are part of the Treaty of Babel, a standard adopted by the interactive fiction community to enable cataloguing, indexing, and cross-referencing of IF works across tools and databases such as [IFDB](https://ifdb.org).

## This Game's IFID

The IFID for Canonical Cave Adventure is stored in `/ifid.txt` at the repository root and referenced by:

- `client/ifid.ts` — exports the IFID constant for use in the game runtime
- `ifiction.xml` — the iFiction metadata record for IF tools and databases
- `web/index.html` — embedded as a meta tag for web crawlers
- The in-game `about` and `version` commands

## Stability Rules

**The IFID must never be changed or regenerated after the first release.**

- The IFID uniquely identifies this game across all IF databases and tools.
- Changing it would cause the game to appear as an entirely different work, breaking any existing IFDB entries, reviews, ratings, or cross-references.
- If the game is forked into a substantially different work, the fork should generate its own new IFID.

## Related Files

| File | Purpose |
|------|---------|
| `/ifid.txt` | Single source of truth for the IFID value |
| `/client/ifid.ts` | Runtime module exporting the IFID |
| `/ifiction.xml` | iFiction metadata record (Treaty of Babel format) |
| `/web/index.html` | HTML meta tag for web discovery |
| `/tools/injectIfMeta.js` | Build script ensuring IF meta tags survive Expo export |
| `/.github/workflows/deploy.yml` | Deploys ifiction.xml to the static site root |
