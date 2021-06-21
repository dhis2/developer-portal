---
id: publish-apphub
title: How to setup continuous delivery to the App Hub
---

Once you have [submitted](/docs/guides/submit-apphub) your app and it's been reviewed by the DHIS2 Core Team, your app is live on the App Hub and can be installed directly from other DHIS2 instances through the App Management App. However, it is annoying and time consuming to upload new app versions manually, and difficult to keep it in sync with your development process. This guide will walk you through how to setup continuous delivery to the App Hub, so new versions are automatically built and published on the App Hub.

:::note

This guide assumes that your app is built using the [DHIS2 Application Platform](https://platform.dhis2.nu/#/). See the [tutorial](/docs/tutorials/setup-env) for how to build your first DHIS2 app.

:::

> We will use [GitHub Actions](https://docs.github.com/en/actions) to power the continuous integration process. It is recommended that you to familiarize yourself with the Github Actions' documentation, but it's not necessary for a simple CI setup.

#### 1. Sign in to the [DHIS2 App Hub](https://apps.dhis2.org/)

Click the profile-icon on the top right and click "Your API Keys".

#### 2. Generate your API key

Click "Generate API key". Write this key down, you will not be able to see it again.

#### 3. Setting the repository secret

Navigate to the GitHub repository of your app. Click "Settings" -> "Secrets". Click "New repository secret". Use `D2_APP_HUB_API_KEY` as the name and paste the API-key in the previous step as the value.

#### 4. Setting the app id

The App Hub needs to know which app your app-version belongs to. This is done using the ID-field in the `d2.config.js`.

Navigate to the App Hub and find your app in the list. Click on the app, and copy the `id` from the browser URL. The ID should look like `b783bf32-0cc2-4d31-aadc-22d4c4807c30`.

Set the `id` field in the `d2.config.js` in your app to the id of the app on the App Hub.

The `minDHIS2Version` is also required, so set the minimum DHIS2 version that your app is compatible with.

Double check that all the information is correct, the upload will fail if there's a mismatch between he App Hub information and the config-information.

```js title="d2.config.js"
const config = {
  id: "b783bf32-0cc2-4d31-aadc-22d4c4807c30",
  title: "Simple Example App", // this should match the name of your app on the App Hub
  type: "app",
  entryPoints: {
    app: "./src/App.js",
  },
  minDHIS2Version: "2.34",
};
module.exports = config;
```

#### 4. Adding GitHub Action Workflow

Here's an example of a minimal workflow that you can use. This will build the app and publish it to the App Hub whenever a release is created on GitHub.
Copy this file to `.github/workflows/apphub-release.yml` in your repository. Remember to push the file. You may also use the GitHub interface for this (Actions -> New Workflow).

```yml title="apphub-release.yml"
# This is a basic workflow to help you get started with Actions
name: App Hub publish

env:
  D2_APP_HUB_API_KEY: ${{secrets.D2_APP_HUB_API_KEY}}

# Controls when the action will run.
on:
  # Triggers the workflow when a new release is created
  release:
    types: [created]

  # Allows you to run this workflow manually from the Actions tab
  workflow_dispatch:

  build:
    # The type of runner that the job will run on
    runs-on: ubuntu-latest

    # Steps represent a sequence of tasks that will be executed as part of the job
    steps:
      # Checks-out your repository under $GITHUB_WORKSPACE, so your job can access it
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: 12.x
      - uses: c-hive/gha-yarn-cache@v1

      - name: Install JS dependencies
        run: yarn install

      - name: Build
        run: yarn build

      - name: Release to DHIS2 App Hub
        run: yarn run d2-app-scripts publish
```

#### 5. Prepare a release

Run `yarn version --patch`. This will bump the version of your app, and your app should be ready for publishing. Push this to the remote: `git push origin main --follow-tags`.

#### 6. Create a release

Navigate to the app repository on GitHub and Click `Releases` on the Section on the right.

Click `draft a new release`. Use the tag-version that was created in the previous step (eg `v1.1.5`).
Optionally type in a release title and description and click `Publish release`.

The GitHub action should be triggered and after a couple of minutes your new version should be pushed to the App Hub! 🎉

You can check the Action status and logs by clicking the Actions-tab in GitHub.

---

## FAQ

### The Action is failing, what do I do?

There can be multiple reasons why the action is failing. The first step is to check the Action log for details and identify which step is failing. Navigate to the `Actions`-tab in your GitHub repository and find the workflow run that failed. Most of the time the failure should describe what went wrong.

### I already have a CI workflow, how can I integrate this?

Publishing to the App Hub should be easy, and the heavy lifting is done by the `d2-app-scripts publish`-command. This command reads information from the `d2.config.js` (or your `manifest.webapp`), and is using that information to upload your app-versions. Assuming your app is configured correctly it should be enough to just run `d2-app-scripts publish` as a release step after your build/test step.

### My app is not a DHIS2 Application Platform app, can I still take advantage of continuous delivery?

We encourage you to migrate to the Application Platform to get a lot of the setup and platform features included, however in many cases this might not be a viable option.

Please refer to the [documentation for the publish command](https://platform.dhis2.nu/#/scripts/publish?id=upload-a-non-platform-app) to learn how to upload any app to the App Hub.
