# Overview

This repository contains the following:

- ESLint configurations (see [`eslint-configs/README.md`](./eslint-configs/README.md))
- Shared GitHub Workflows (see `.github/workflows/reusable-*.yml`)
- Shared E2E test helpers (coming soon!)

## Releasing

First, decide on what type of release to perform, then:

1. Switch to a new branch
2. Run `npm run lerna-version -- <major | minor | patch>, and commit the result
3. Push the branch and create a pull request
4. Once approved, merge the pull request and create a GH release with the latest version as a tag.
   The tag being pushed will trigger CD.
