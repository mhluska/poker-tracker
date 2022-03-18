#!/bin/bash

set -e # If anything fails, stop the script.
set -u # If an undefined variable is expanded, stop the script.

ROOT=$(git rev-parse --show-toplevel)

cd "${ROOT}"

cp ./node_modules/modern-normalize/modern-normalize.css postbuild/
