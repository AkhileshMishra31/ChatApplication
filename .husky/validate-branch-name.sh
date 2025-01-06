#!/bin/bash

branch_name=$(git symbolic-ref --short HEAD)

regex="^(feature|bug|task)/[0-9]{4}-[a-zA-Z0-9]{1,3}$"

if [[ ! "$branch_name" =~ $regex ]]; then
  echo "🛑 Invalid branch name: $branch_name"
  echo "Branch names must follow the pattern: '<type>/4digit-description' where the type is either 'feature', 'bug', or 'task' and the description is 1 to 3 alphanumeric characters."
  exit 1
fi
