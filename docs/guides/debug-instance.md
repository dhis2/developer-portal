---
id: debug-instance
title: How to debug common development errors
---

If you encounter some errors when trying to connect to your application or during development, please try the following troubleshooting steps: 

##  CORs whitelist

If you run into Cross-Origin Resource Sharing (CORs) policy issues when connecting to your server, you could start with the **CORs whitelist**. 

### What is the CORs whitelist?

In a DHIS2 instance, by default only web applications that are running on the same URL can access that DHIS2 instance. 

There's a **CORs whitelist** option that can be configured to add other URLs besides the current one and allow that DHIS2 application instance. 

### Where do I change it? 

When you login to your instance, click on the apps icon and search for **System Setting** application. Then go to **Access** from the menu on the left and scroll down to see the **CORs whitelist** option. 

There you can add the URLs that you want to grant access. The settings will be automatically updated by tabbing out of that. 

See below:

![](./assets/cors-whitelist.gif)

## If you're using Chrome 

There are a few things that you could do if you're using Chrome and the problem persists: 

### SameSite by default cookies flag

Disable the default SameSite Cookie behavior in Chrome by setting the "SameSite by default cookies" flag [chrome://flags/#same-site-by-default-cookies](chrome://flags/#same-site-by-default-cookies) to **Disabled**. You may need to restart your browser to apply the new setting. 

**Note**: this disables legitimate security behaviors in your browser, so proceed with caution! We recommend that you only disable this flag when actively debugging a DHIS2 application. 

Read this blog to learn more about [SameSite Cookie Policies and DHIS2 Applications](../../blog/cross-origin-cookies).  

### Disabling cache

You could also try disabling the cache from the network tab in Chrome DevTools. See below:

![](./assets/disable-cache.png)

## Node version

Make sure that you are running a compatible version of [Node.js](https://nodejs.org/en/download/) as using older versions may throw some errors during setup. 

## Others?

Please let us know and we will continue adding those to the list 👌🏽 