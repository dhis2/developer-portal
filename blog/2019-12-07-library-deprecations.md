---
slug: 2019/12/library-deprecations
title: Web Application Library deprecations
authors: varl
tags: [deprecation, libraries, webapp]
---

In 2019 we established a new application development paradigm with
the [App Platform](https://platform.dhis2.nu). The Platform provides
a unified framework for DHIS2 Web App development, so it is time to
deprecate a few of our legacy libraries!

<!--truncate-->

This does not mean that these deprecated libraries will cease to work immediately,
but they should be avoided in new applications and (eventually) replaced in existing
ones.

In some cases there may still be a good reason to use some of the **legacy** libraries.
For instance, a component you need may exist in `d2-ui` but not (yet) in `ui-core` or
`ui-widgets`. In this case it is still acceptable to use `d2-ui` while waiting for the
new components to be added.

# Deprecated Libraries

These libraries have been deprecated and **should be replaced before the
2.34 release** in all Apps.

-   [core-resource-app](https://github.com/dhis2/core-resource-app) is a
    "poor man's CDN" that worked for a long time, but is fundamentally
    incompatible with the way we want to develop distinct isolated web
    apps. It adds quite a bit of bloat to the WAR-file and will be
    removed in 2.34.

-   [d2-manifest](https://github.com/dhis2/d2-manifest) generates a
    `manifest.webapp` which is quite confusing, as the standard
    `d2-manifest` uses is the Open Web App standard currently only
    supported by Firefox OS.

    It predates the W3c Progressive Web App standard, and that is why
    DHIS2 historically implemented the OWA standard and not the PWA
    manifest standard.

    We are moving to the W3c manifest standard though, so that should be
    used going forward.

# Legacy libraries

These libraries are still used and supported, but are not being actively developed.
They will receive some bug fixes but no new features. These libraries will be
deprecated in the future (probably around 2.35) and so should be avoided.

-   [d2-ui](https://github.com/dhis2/d2-ui) is being replaced by new user
    interface libraries ([ui-core](https://github.com/dhis2/ui-core) and
    [ui-widgets](https://github.com/dhis2/ui-widgets)). Some components
    in `d2-ui` have not yet been migrated to the new libraries, but in most
    cases `d2-ui` should be avoided.

-   [d2-i18n-generate](https://github.com/dhis2/d2-i18n-generate) and
    [d2-i18n-extract](https://github.com/dhis2/d2-i18n-extract) are used for
    DHIS2 internationalisation and translation. While these are still in
    use in non-platform Apps, we now provide this out of the box in the
    [App Platform](https://github.com/dhis2/app-platform) instead of as
    distinct libraries.

-   [d2-charts-api](https://github.com/dhis2/d2-charts-api) and
    [d2-analysis](https://github.com/dhis2/d2-analysis) have been
    superseded by [analytics](https://github.com/dhis2/analytics).

# Deprecated tools

These tools have been completely deprecated and replaced, they should not be used.

-   [cli-packages](https://github.com/dhis2/cli-packages) has been
    fully deprecated in favor of Yarn Workspaces and strict single-entry
    point libraries.

-   [d2-i18n-monitor](https://github.com/dhis2/d2-i18n-monitor) a
    stand-alone site for monitoring the translation status of our apps.
    This has been superseded by [Transifex](https://transifex.com).
