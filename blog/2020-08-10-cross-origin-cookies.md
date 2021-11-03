---
slug: cross-origin-cookies
title: SameSite Cookie Policies and DHIS2 Applications
author: Austin McGee
# author_title:
author_url: https://github.com/amcgee
author_image_url: https://avatars.githubusercontent.com/u/947888?s=400&u=2051953d3237171aee830b7b3ee266a10995dcb2&v=4
tags: [app platform, developer tools, webapp, troubleshooting, authentication]
---

As of mid-July 2020, the Chrome (and Chromium) stable release channel [has started to disable cross-site cookies by default](https://www.chromium.org/updates/same-site). Mozilla Firefox has pushed this change to their [beta channel and will likely release it to the stable channel soon](https://hacks.mozilla.org/2020/08/changes-to-samesite-cookie-behavior/). This change affects any DHIS2 application running **on a different domain than the DHIS2 server instance**, including applications running on localhost in development. It does not affect cross-site API requests which use Basic or OAuth authentication headers, as those do not rely on cookies for authentication.

<!--truncate-->

## What is the SameSite Cookie attribute?

Basically, browsers are starting to block, by default, most cookies (which typically contain sensitive information such as login session tokens) to a domain which does not match the current URL of the site visited in the browser. The SERVER (not the browser) must set a specific attribute on the cookie (called `SameSite` to have the value `None`) if the cookie is safe to include in cross-domain requests. The attribute `Secure`, which requires that the cookie only be sent over encrypted HTTPS connections, MUST also be set on the Cookie because [it is now required for `SameSite=None` cookies](https://web.dev/samesite-cookies-explained/#samesitenone-must-be-secure). DHIS2 does not set these attributes on its authentication cookies. As of mid-July, popular browsers like Chrome and Firefox are beginning to enforce these rules.

Confused? [Learn more here](https://web.dev/samesite-cookies-explained/)

## How does this affect DHIS2?

The vast majority of DHIS2 users and implementers will not be affected by this issue. DHIS2 applications which are directly installed into a DHIS2 instance (either core applications or custom ones installed through the App Management app) will continue to work without any interruptions.

However, applications running on **another server under a different domain** will stop functioning in browsers which implement this new security feature. The most common place this occurs is during application development when your local application (running at `http://localhost:3000`, for instance) attempts to connect and authenticate with a remote DHIS2 server (running at `https://dhis2.myorg.com`, for instance). When this happens, authentication will fail and the developer will see repeated HTTP 401 (`Error: Unauthorized`) errors in the developer console. A warning will also appear, at least in Chrome, similar to the following (it also appears in older versions **which do not yet implement the feature**):

> A cookie associated with a cross-site resource at http://dhis2.org/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.

In very rare cases, a production DHIS2 application might be running on a different domain than the DHIS2 server. If this issue is affecting a production application in your environment [please let us know as soon as possible by opening a Jira ticket!](https://jira.dhis2.org)

## How can I work around this for application development?

### Using a local DHIS2 instance

By far the most secure way to work around this issue during application development is to run a local instance of DHIS2 against which you can test your application. You can easily spin up one or more DHIS2 instances locally using Docker and the `d2 cluster` command of the [DHIS2 CLI](https://cli.dhis2.nu/#/commands/d2-cluster)

### In Google Chrome or Chromium-based browsers

To check your current Google Chrome version: click on the three dots menu > Help > About Google Chrome > Your Chrome version number will be displayed.

#### Chrome 90 and earlier versions

It is possible to disable the default `SameSite=Lax` behavior in Chrome and Chromium by setting the "SameSite by default cookies" flag [chrome://flags/#same-site-by-default-cookies](chrome://flags/#same-site-by-default-cookies) to **Disabled**.

Note that this **disables legitimate security behaviors** in your browser, so proceed with caution! We recommend that you only disable this flag when actively debugging a DHIS2 application.

#### Chrome version 91

The flags `#same-site-by-default-cookies` and `#cookies-without-same-site-must-be-secure` have been removed from chrome://flags as of Chrome 91, as the behavior is now **enabled by default**. [Learn more over the update docs from chromium.org](https://www.chromium.org/updates/same-site).

**Disable using the command-line flag**:

You can mention flags that you need to disable on your terminal. Note that you will need to close all instances of Chrome that are running before executing the following commands:

1.  For Mac users:

```
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome
--disable-features=SameSiteByDefaultCookies,CookiesWithoutSameSiteMustBeSecure
```

2. For Windows users:

```sh
Chrome Application Path
--disable-features=SameSiteByDefaultCookies,CookiesWithoutSameSiteMustBeSecure
```

:::note
**Note:** In Chrome 94, the command-line flag `--disable-features=SameSiteByDefaultCookies,CookiesWithoutSameSiteMustBeSecure` will be removed.
:::

### In Mozilla Firefox

Firefox stable channel does not yet enforce this cookie policy, so for the moment everything should continue to work. Currently there doesn't appear to be an easy way to disable the policy in Firefox Beta. Stay tuned for updates, and if you find a workaround please share it in the comments below!

## How can I work around this for production applications running on a separate domain?

> **NOTE** Applications installed directly on a DHIS2 application (using the DHIS2 App Management app) will be available on the same domain as the DHIS2 instance, and so **are not affected by this issue**

If a production application is hosted on a separate server and domain than the DHIS2 instance, and it uses cookies for authentication (the most common setup), it **will be affected** by this issue. In order to restore funtionality to external applications it is necessary to set the `SameSite=None; Secure` attributes on the DHIS2 authentication cookie and to run the DHIS2 instance with SSL/TLS enabled (so that it is only accessible over HTTPS). DHIS2 does not currently support this behavior by default, so it is necessary to modify the server's cookie responses in a gateway such as NGINX or Apache. If you are hosting a production application outside of your DHIS2 instance and affected by this issue **please reach out to the DHIS2 core team so that we can be made aware of use-cases and can help you work around the issue with a gateway setup**

## Will the DHIS2 Core address this long-term?

In short, we aren't sure if or how we will change the default behavior or DHIS2 cookie authentication yet. We are evaluating options for secure cross-domain authentication and simplified application development workflows, and will share more when we have more information.
