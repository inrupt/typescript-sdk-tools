#!/usr/bin/env bash

git diff --quiet
isDirtyRepo=$?

if [ $isDirtyRepo -eq 1 ]; then
  echo "Repository is in a dirty state, refusing to prepare a release"
  exit 1
fi

lerna version --exact --no-git-tag-version --no-push --no-changelog --no-private

git diff --quiet lerna.json
didVersion=$?

# If the lerna.json file hasn't been changed, exit:
if [ $didVersion -eq 0 ]; then
  echo "\nAborting release preparation: lerna.json didn't change"
  exit 0
fi

# must happen after lerna version as to grab the correct version number,
# we can use require on json thanks to using commonjs as the type in the root package.json
nextVersion=$(node -pe 'require("./lerna.json").version')
packages=$(node -pe 'require("./package.json").workspaces.map((pkg) => `${pkg}/package.json`).join(" ")')

git switch -c "release/$nextVersion"

git add lerna.json $packages
git commit -m "chore(release): publish $nextVersion"
