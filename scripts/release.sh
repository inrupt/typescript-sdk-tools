#!/usr/bin/env bash

CI=${CI:-unset}

if [ "$CI" == "unset" ]; then
  echo "This script should only be run from CI, see the Releasing instructions in the README.md"
  exit 1
fi

# detect whether we're doing a pre-release or not:
version=$(node -pe 'require("./lerna.json").version')
isPreRelease=$(node -pe 'require("./lerna.json").version.includes("-")')

# Publish the release with lerna, which automatically detects pre-releases,
# --no-verify-access is required as automation tokens can't list packages
# we use from-package as we've already run `lerna version`:
lerna publish from-package --yes --no-verify-access --temp-tag --loglevel verbose

# Don't try creating the release if the publish failed:
if [ $? -neq 0 ]; then
  exit $?
fi

# Finally, create the release on GitHub:
if [ "$isPreRelease" == "true" ]; then
  gh release create "$version" --generate-notes --prerelease
else
  gh release create "$version" --generate-notes
fi
