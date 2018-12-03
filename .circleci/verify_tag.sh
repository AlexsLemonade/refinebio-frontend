#!/bin/bash

# This script verifies that the tag triggering this deployment was signed
# by a trusted member of the CCDL.

for key in keys/*; do
    gpg --import keys/$key
done

# If it is not a good key then the exit code is 1, which will cause
# the deploy to fail.
git tag --verify $CIRCLE_TAG
