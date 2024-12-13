---
slug: 2024/12/app-platform-v12
title: App Platform v12
authors: [core, kai]
tags: [app platform, developer tools, webapp, announcement]
---

# Platform v12 Release, Vite and React 18 Migration Guide

Good news! Vite and React 18 in the app platform are ready to use! Vite replaces the deprecated Create React App (CRA) for starting and build apps, and React v18 replaces v16. 

We're very excited for these updates — both will significantly modernize the App Platform, and Vite will be a big upgrade from CRA. It will greatly improve the developer experience, and with greater control over the configuration, it will open up some powerful new possibilities for the platform.

Here are some tips about what to expect, and how to easily upgrade to the latest version of `@dhis2/cli-app-scripts` to take advantage of Vite and React 18.

<!-- truncate -->

### Notable changes

These are some things that you'll see right away after upgrading:

-   It's fast! Starting up an app is nearly instant, and building an app is about 3-4 times faster compared to CRA
-   Plugins are handled better:
    -   Start-up of both the app and plugin is nearly instant
    -   The app and plugin are run on the same port
    -   Support for a plugin without an app is improved
    -   Code is shared between entrypoints, which makes bundles smaller
    -   Hot Module Replacement (HMR) for code changes in the plugin will be as fast as in the app
-   There are some new TypeScript features:
    -   Bootstrapping an app with a TypeScript template is supported: `d2-app-scripts init --typescript my-app`. See the [`init` docs](/docs/app-platform/scripts/init) for more about the command
    -   Vite has native support for TypeScript
    -   Although not in the App Platform package, with the latest `@dhis2/cli-style`, TypeScript type checking is performed when running `d2-style lint`
    -   With `@dhis2/ui` version 9, the UI library is now typed as well
-   There's a small suite of tools available in the CLI when running an app in dev mode:
    -   With the dev server running, press `h + enter` to see the options
    -   Options include exposing the server on LAN, opening the app in the browser, cleanly quitting the server, and restarting the dev server (which can be helpful if you're modifying libraries in `node_modules`)
-   The build output includes a summary to inspect chunks

### Future changes

With Vite, the door is open for some big future improvements. We've already created JIRA tickets for these, so if you're interested in staying up-to-date on them you can watch these tickets.

-   Extensible config: developers can add their own options to the Vite config, for example a plugin for Flow types, or to define import aliases ([LIBS-706](https://dhis2.atlassian.net/browse/LIBS-706))
-   Arbitrary entrypoints, beyond app/plugin/lib: Make a regular app, a configuration app, a capture plugin, a dashboard plugin, and more all from the same repo and sharing code between them ([LIBS-394](https://dhis2.atlassian.net/browse/LIBS-394))

With respect to TypeScript, work is also under way to add types to data fetching tools using specs generated from OpenAPI ([LIBS-523](https://dhis2.atlassian.net/browse/LIBS-523)).

## Getting started

By running these steps, you should be able to run your app right away:

1. `yarn add @dhis2/app-runtime @dhis2/ui -D @dhis2/cli-app-scripts`
2. `npx yarn-deduplicate yarn.lock && yarn`
3. Try out `yarn start --allowJsxInJs`, and your app should be running 🚀

There will be some other changes you will want to make, which are described in detail in the [migration guide](/docs/app-platform/migration/v12). Our goal is to make it easy to adopt the new changes, so we have some tools to facilitate the process.

Head on over to the [migration guide](/docs/app-platform/migration/v12) for more detailed instructions and technical background information.

Enjoy the updates, and happy coding!
