---
slug: 2022/07/app-platform-v10
title: App-platform v10
author_title: DHIS2 Core Team
tags: [app platform, developer tools, webapp, announcement]
---

We have just released a new major version of the app-platform: version 10. Upgrading to version 10 should be relatively easy for all apps currently using version 9 of `cli-app-scripts`. In this post we'll walk you through the most important change for this release.

<!--truncate-->
## Node support

There is only one breaking change in this major release. We have dropped support for node 12, meaning that the app-platform libraries now only support node 14 and node 16, the current LTS versions of node. Node 12 is no longer under active development and some of our dependencies are dropping support for it, so we felt it was time we did the same.

It should be an easy upgrade for everyone, all you'll have to do is update the version of node you're using locally or in your continuous integration (CI) pipelines. For a detailed overview of all the changes in this platform release you can view the [changelog](https://github.com/dhis2/app-platform/blob/master/CHANGELOG.md#1000-2022-07-26). If you have questions or encounter any issues please let us know via any of the options on [our community support page](https://developers.dhis2.org/community/support).
