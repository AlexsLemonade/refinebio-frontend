#!/bin/bash

# A tag is linked to a commit hash, not a branch. A single commit hash
# can end up on multiple branches. So we first check to see if we're
# on master, then on dev, then error out because we should only deploy master or dev.
get_master_or_dev() {
    master_check=$(git log --decorate=full | head -1 | grep origin/master || true)
    dev_check=$(git log --decorate=full | head -1 | grep origin/dev || true)

    if [[ ! -z $master_check ]]; then
        echo "master"
    elif [[ ! -z $dev_check ]]; then
        echo "dev"
    else
        echo "Why in the world was update_docker_img.sh called from a branch other than dev or master?!?!?"
        exit 1
    fi
}

branch=$(get_master_or_dev)

if [[ $branch == "master" ]]; then
    base_host="refine.bio"
elif [[ $branch == "dev" ]]; then
    base_host="staging.refine.bio"
else
    echo "Why in the world was update_docker_img.sh called from a branch other than dev or master?!?!?"
    exit 1
fi

yarn install --ignore-engines

CI=false REACT_APP_API_HOST=https://api.$base_host yarn run build

if [[ $branch == "dev" ]]; then
    # generate robots.txt file on staging https://github.com/AlexsLemonade/refinebio-frontend/issues/376
    echo -e "User-agent: *\nDisallow: /">build/robots.txt
fi

pip install awscli --upgrade --user

~/.local/bin/aws s3 sync build s3://$base_host --delete --acl public-read

# Only deploy to www.refine.bio on master branch.
if [[ $branch == "master" ]]; then
    ~/.local/bin/aws s3 sync build s3://www.$base_host --delete --acl public-read
fi
