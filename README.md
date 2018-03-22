# Refine.bio Frontend

[![forthebadge](https://forthebadge.com/images/badges/built-with-swag.svg)](https://forthebadge.com)

This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

You can find the most recent version of the Create React App guide [here](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md).

## Table of Contents

* [Getting Started](#getting-started)
* [Development](#development)
  * [Git Workflow](#git-workflow)
  * [Styling](#styling)

## Getting Started

### Requirements

For development, you will need Node.js and [Yarn package manager](https://yarnpkg.com/en/) installed on your environment.

You can install Yarn through [Homebrew package manager](https://brew.sh/). This will also install Node.js if not already installed.

`brew install yarn`

### Initialize

In the project directory, run:

#### `yarn install`

### Develop

In the project directory, run:

#### `yarn start`

* Runs the app in development mode
* Open http://localhost:3000 to view it in the browser
* Page will reload if you make any edits
* You will also see lint errors in the console

### Production

#### `yarn run build`

* Builds the app for production to the `./build` folder
* Correctly bundles React in production mode and optimizes the build for the best performance
* Build is minified and filenames include hashes

## Development

### Git Workflow

This project uses a [feature branch](http://nvie.com/posts/a-successful-git-branching-model/) based workflow.

New features should be developed on new feature branches named in the following format: `[username]/[fancy-branch-name]`.
Pull requests should be sent to the `develop` branch for code review.
Merges into `master` happen at the end of sprints, and tags in master correspond to production releases.

### Styling

* Pre-processor: [SASS](https://sass-lang.com/)
* Locally scoped class names with [CSS Modules](https://github.com/css-modules/css-modules)
  * for a `.scss` file to uses modules, the file must be named in the following format: `[name].module.scss`
  * non-prefixed files will be parsed normally
* Configured using [custom-react-scripts](https://github.com/kitze/custom-react-scripts) to avoid losing future creat-react-app support
