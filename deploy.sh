#!/usr/bin/env bash
set -e

if [ "$TRAVIS_BRANCH" == "master" ]; then

echo "Deploying the app to GitHub Pages..."

cd dist
rm -f *.zip

rm manifest.webapp
mv manifest.webapp.test manifest.webapp

# The first and only commit to this new Git repo contains all the
# files present with the commit message "Deploy to GitHub Pages".
git init

# inside this git repo we'll pretend to be a new user
git config user.name "Travis CI"
git config user.email "builds@travis-ci.org"

git add .
git commit -m "Deploy to GitHub Pages"

echo "Pushing changes to the gh-pages branch."
# Force push from the current repo's master branch to the remote
# repo's gh-pages branch. (All previous history on the gh-pages branch
# will be lost, since we are overwriting it.) We redirect any output to
# /dev/null to hide any sensitive credential data that might otherwise be exposed.
git push --force --quiet "https://$GITHUB_PAGES_TOKEN@github.com/rkorytkowski/openmrs-owa-conceptdictionary.git" HEAD:gh-pages > /dev/null 2>&1

echo "Done deploying the app to GitHub Pages."

fi
