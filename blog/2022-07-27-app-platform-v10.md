---
slug: 2022/07/app-platform-v10
title: App-platform v10
author: Ismay
tags: [dhis2, app-platform]
---

We have just released a new major version of the app-platform: version 10. Upgrading to this new version should be relatively easy for all apps currently using version 9 of `cli-app-scripts`. In this post we'll walk you through the most important change for this new version.

## Node support

The one breaking change for this release is that we've dropped support for node 12. This means that now only the current LTS versions of nodejs will be supported by the app-platform libraries, which is node 14 and up. Node 12 is no longer under active development and we were seeing some of our dependencies dropping support for it, so we felt it was time we did the same.

It should be an easy upgrade for everyone, all you'll have to do is update the version of node you're using locally or in your continuous integration (CI) pipelines. If you encounter any issues let us know! For a detailed overview of all the changes in this platform release you can view the [changelog](https://github.com/dhis2/app-platform/blob/master/CHANGELOG.md#1000-2022-07-26)
