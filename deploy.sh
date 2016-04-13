#!/bin/bash
set -e # exit with nonzero exit code if anything fails

# go to the dist directory and remove zip
cd dist
rm -f *zip || exit 0;

# create a *new* Git repo
git init

# The first and only commit to this new Git repo contains all the
# files present with the commit message "Deploy to GitHub Pages".
git add .
git commit -m "Deploy to GitHub Pages"

# Force push from the current repo's master branch to the remote
# repo's gh-pages branch. (All previous history on the gh-pages branch
# will be lost, since we are overwriting it.) We redirect any output to
# /dev/null to hide any sensitive credential data that might otherwise be exposed.
git push --force --quiet "https://${GITHUB_PAGES_TOKEN}@github.com/rkorytkowski/openmrs-owa-conceptdictionary.git" HEAD:gh-pages > /dev/null 2>&1