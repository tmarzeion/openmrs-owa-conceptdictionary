#!/bin/bash
echo "Running deployment script..."

set -e # exit with nonzero exit code if anything fails

echo "Opening the dist directory and removing the zip zip"
cd dist
rm -f *zip

echo "Creating a new Git repo and committing changes"
git init

# The first and only commit to this new Git repo contains all the
# files present with the commit message "Deploy to GitHub Pages".
git add .
git commit -m "Deploy to GitHub Pages"

echo "Pushing changes to GitHub Pages"

# Force push from the current repo's master branch to the remote
# repo's gh-pages branch. (All previous history on the gh-pages branch
# will be lost, since we are overwriting it.) We redirect any output to
# /dev/null to hide any sensitive credential data that might otherwise be exposed.
git push --force --quiet "https://${GITHUB_PAGES_TOKEN}@github.com/rkorytkowski/openmrs-owa-conceptdictionary.git" HEAD:gh-pages > /dev/null 2>&1