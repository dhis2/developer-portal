---
slug: 2022/07/app-platform-v10
title: App-platform v10
author: Ismay
tags: [dhis2, app-platform]
---

We have just released a new major version of the app-platform: version 10. This new version should be relatively easy to update to for everyone. In this post we'll walk you through the most important change for this new version.

## Node support

The one breaking change for this release is that we've dropped support for node 12. This means that the app-platform libraries now only support the current LTS versions of node, which are node 14 and up. Node 12 is no longer under active development and we were seeing some of our dependencies dropping support for it, so we felt it was time we did the same.

It should be an easy upgrade for everyone, all you'll have to do is update the version of node you're using locally or on CI. If you encounter any issues let us know! For a detailed overview of what’s changed you can view the [changelog](https://github.com/dhis2/app-platform/blob/master/CHANGELOG.md#1000-2022-07-26)
