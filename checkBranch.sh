#!/usr/bin/env bash
LC_ALL=C

local_branch="$(git rev-parse --abbrev-ref HEAD)"
acceptable_branch_names="feature, feat, chore, devop, release, and hotfix"
valid_branch_regex="^(feature|feat|fix|chore|devop|release|hotfix|ui)\/[a-z0-9._-]+$"

message="Commit rejected! Please make sure your branch name starts with any of the following: $acceptable_branch_names."

echo $local_branch
if [[ $local_branch != "master" && $local_branch != "develop" ]]
then
  if [[ ! $local_branch =~ $valid_branch_regex ]]
    then
      echo "$message"
      exit 1
  fi
fi

exit 0
