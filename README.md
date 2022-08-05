# Overview

This repository contains the following:

- ESLint configurations (see [`eslint-configs/README.md`](./eslint-configs/README.md))
- Shared GitHub Workflows (see `.github/workflows/reusable-*.yml`)
- Shared E2E test helpers (coming soon!)

## Releasing

First, decide on what type of release to perform, then:

1. Run: `npm run prepare-release`

   Follow the prompt and select the type of release:

   - Patch (1.0.1)
   - Minor (1.1.0)
   - Major (2.0.0)
   - Prepatch (1.0.1-alpha.0)
   - Preminor (1.1.0-alpha.0)
   - Premajor (2.0.0-alpha.0)

   After confirming, this will update all the `package.json` versions to that new version number,
   checkout a new branch `release/<version>` and commit the changed files.

2. Push the branch & create a pull request

3. Merge the pull request, and then let automation do the rest.
