# Refine.bio Frontend

[![forthebadge](https://forthebadge.com/images/badges/built-with-swag.svg)](https://forthebadge.com)

This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app) and later migrated to [NextJS](https://nextjs.org/)

## Table of Contents

- [Getting Started](#getting-started)
- [Development](#development)
  - [Git Workflow](#git-workflow)
  - [JavaScript](#javascript)
    - [Framework](#framework)
    - [Formatting](#formatting)
  - [Styling](#styling)
- [Executive Dashboard](#executive-dashboard)
- [Running Locally](#running-locally)

## Getting Started

### Requirements

For development, you will need [Node.js](https://nodejs.org/en/download/) and [Yarn package manager](https://yarnpkg.com/lang/en/docs/install/) installed on your environment.

If you are using a Mac, you can install Yarn through [Homebrew package manager](https://brew.sh/). This will also install Node.js if not already installed.

`brew install yarn`

### Initialize

In the project directory, run:

#### `yarn install`

### Develop

In the project directory, run:

#### `yarn run dev`

- Runs the app in development mode
- Open http://localhost:3000 to view it in the browser
- Page will reload if you make any edits
- You will also see lint errors in the console

### Production

#### `yarn run build`

- Prefetches the api version and other data required to run the app.
- Builds the app for production to the `./next` folder
- Correctly bundles React in production mode and optimizes the build for the best performance

#### `yarn run start`

- Initializes the app in production mode
- Open http://localhost:3000 to view it in the browser

#### Deployment

Deploys are triggered automatically by pushing to the `master` or `dev` branches.

## Development

### Git Workflow

This project uses a [feature branch](http://nvie.com/posts/a-successful-git-branching-model/) based workflow.

New features should be developed on new feature branches named in the following format: `[username]/[fancy-branch-name]`.
Pull requests should be sent to the `dev` branch for code review.
Merges into `master` happen at the end of sprints, and tags in master correspond to production releases.

### JavaScript

#### Framework

This project is using [React](https://reactjs.org/) as a frontend framework coupled with [Redux](https://redux.js.org/) for state management.

Also it get's server rendered with [NextJS](https://nextjs.org/).

#### Formatting

We use [Prettier](https://prettier.io/), an opinionated code formatter, for JS code formatting. Whenever a commit is made, Prettier will automatically format the changed files. Prettier can also be [integrated](https://prettier.io/docs/en/editors.html) into many text editors.

### Styling

- Pre-processor: [SASS](https://sass-lang.com/)
- Write resuabled, modularized using [BEM](http://getbem.com/)

## Executive Dashboard

Our executive dashboard is used for monitoring the health and state of our system. The dashboard can be viewed at the `/dashboard` route of the frontend.

## Running Locally

If you have the refine.bio backend running locally, just run the script with the variable `REACT_APP_API_HOST` pointing to the local API. For example:

```
REACT_APP_API_HOST=http://localhost:8000 yarn run dev
```
