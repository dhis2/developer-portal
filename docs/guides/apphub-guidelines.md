---
id: apphub-guidelines
title: App Hub Submission Guidelines
---

Submitting your app to the App Hub is an easy way to share your app with the DHIS2 community around the world. Apps submitted to the App Hub are reviewed by the DHIS2 core team. Apps approved by the DHIS2 core team will be available publicly on the App Hub.

The following guidelines are intended to make the App Hub submission and approval process simple and transparent. Following these guidelines will ensure your app works well on the DHIS2 platform and is well documented on the App Hub.

## App Hub Documentation

Providing good information about your app on the App Hub will help users find your app, quickly understand what it does and know if it is right for their instance.

### App name

An app should have a clear, descriptive name. Try to capture the core functionality of the app in a few words.

In addition, observing the following guidelines will help create a helpful app name:

-   Avoid generic, ambiguous words. Be as specific as possible.
-   Don't include redundant words like "web", "interactive" or "DHIS2". All apps are available on the web, are interactive, and run on DHIS2, so you don't need to include this in the app name.
-   Avoid adjectives in general, especially words like "new", "modern" or "best".
-   Avoid names that are very similar to other core DHIS2 apps or apps on the App Hub.

### App Icon

All apps submitted to the App Hub should have a unique app icon. App icons are shown in the apps menu and help users to quickly navigate around DHIS2. 

> See [how App Icons can be included](https://platform.dhis2.nu/#/usage/app-icon) in your application using the [App Platform](https://platform.dhis2.nu/#/)

Keep the following guidelines in mind when creating an app icon:

-   Try to capture a core idea about your app in an icon. What does your app do? - Try to hint towards that answer with your app icon.
-   Use clear, bold shapes.
-   Avoid photographs or complex shapes.
-   Use contrasting colors to make your icon clear at all sizes.
-   Icons should be uploaded in high-resolution, at least 512×512px in size.
-   Make sure all images and icons are correctly licensed. Do not take images or icons from a web image search without obtaining a license.

### Description

A good app description helps users of the App Hub quickly understand what the purpose of an app is and any requirements to using it.

An app description should clearly and concisely answer the following questions:

-   What does this app allow a user to do? Explain the core functionality.
-   Who is this app useful for? Define the target audience if one exists.
-   How does this app provide that functionality? Quickly summarize the main interaction.
-   Will this app only work on some DHIS2 instances? Be clear about any requirements for the app to function, such as how metadata is structured. Remember, DHIS2 apps in the App Hub should be generic.
-   What technical requirements does this app have? Make it easy for users to know if they can use this app. Be clear and upfront about any performance or network requirements.
-   All connections to external services must be clearly declared.

A short, clear app description for a core DHIS2 app, Data Visualizer, might look like this:

_Create charts, tables and other visualizations from aggregate data. Data Visualizer is useful for any DHIS2 instance that wants to see their aggregate data visually. Visualizations can be included in Dashboards. Making visualizations is as easy as choosing data and dimensions, organizing them in the layout and choosing a visualization type. Data visualizer works on all DHIS2 versions that collect aggregate data. A network connection is needed to download data and save visualizations._

### Screenshots

Screenshots provide a quick overview of an app's interface and any generated items.

To provide helpful screenshots, follow these guidelines:

-   3–5 screenshots is usually enough for most apps, every screen of the app doesn't need to be shown.
-   Use a common screen size to show in-app screenshots, 1280×800px is a good, easy-to-view size.
-   Screenshots should show the app in-use with data. Empty screens are rarely interesting or helpful.
-   Show the common or main use-case of the app in at least one screenshot.
-   Include an example screenshot of anything that the app generates, like reports or documents.

### Source code

Sharing the source code of your app helps the DHIS2 core team carry out a quick review process and lets technical users evaluate if the app is right for their instance.
You can share your source code with a link to a public repository on a source control platform like Github.

## App guidelines

These guidelines are for the app itself, rather than how it appears on the App Hub. Apps that meet these criteria will be secure, performant and appropriate for the DHIS2 platform.

### Generic

Apps available in the App Hub should, by default, run on any DHIS2 instance. Apps that are flexible and generic are useful for a large audience and can help many DHIS2 users around the world.

### Open-source

Make sure all components, libraries and resources that are running on the DHIS2 instance are open-source. Connections to third-party services do not need to be open source, but must be clearly declared in the app description.

### Design System

The [DHIS2 Design System](https://github.com/dhis2/design-system) provides principles, guidelines and components for designing and building user-friendly apps. Follow the [principles](https://github.com/dhis2/design-system#design-principles) and use the [available components](https://github.com/dhis2/design-system#components) where possible. Apps should be user-friendly and respect a users' time and resources.
The Design System components are available as a set of pre-built React components via [@dhis2/ui](https://github.com/dhis2/ui#readme).

Apps built using the [DHIS2 App Platform](https://platform.dhis2.nu/#/) will automatically include the necessary `Header Bar` component and functionality. Apps not using the App Platform need to manually include and set up the standalone [Header Bar component](https://ui.dhis2.nu/demo/?path=/story/utils-header-bar--default) from `@dhis2/ui`. All DHIS2 apps must include the `Header Bar` component.

### Documentation

Providing thorough documentation is essential for all apps. Documentation can be hosted on your website or a source control platform like Github. Think of documentation like an instruction manual for your app. Most users installing your app from the App Hub will not know how the app works. Documentation helps bridge this gap, introducing the main app interactions and providing guidance for common use cases.

### Security

All apps should follow modern, up-to-date security best practices.

Consider implementing the following guidelines to address harden application security: 

- **Never hard-code security parameters in application source-code**: It is never acceptable to hard-code credentials or encryption keys into application source-code, even if an environment variable is used to inject the key in the application .zip file at build-time.  Everything in the .zip application archive is publicly-accessible to anyone with a browser and should never include any sensitive information.  Encryption keys should never be shared between app installations in different DHIS2 instances.
    - Use `.gitignore` and environment variables to ensure that development environment credentials are not accidentally committed with the source-code. 

- **DataStore and UserDataStore**: It is more secure to put configuration in the UserDataStore in DHIS2, rather than in the DataStore which is shared with all users.  When using either the UserDataStore or DataStore, be sure to:
    - Choose a unique and specific namespace which will not conflict with other applications
    - Reserve the namespace used by your application by specifying it in the `manifest.webapp` file, so that only users with access to that application can access it (see an example of a manifest file [here](https://docs.dhis2.org/en/develop/loading-apps.html#apps_creating_apps)). Functionality to reserve namespaces is coming soon to the Application Platform tools.
    - When storing sensitive information (such as credentials for external systems) in the datastore, set the `?encrypt=true` [query string parameter](https://docs.dhis2.org/en/develop/using-the-api/dhis-core-version-master/data-store.html#webapi_data_store_create_values) in order to ensure that the value is encrypted at rest.
    - Whenever possible, use the [DataStore sharing API](https://docs.dhis2.org/en/develop/using-the-api/dhis-core-version-master/data-store.html#webapi_data_store_sharing) to explicitly grant read and write permissions to the users which need them and **prevent access by any unprivileged users**.  It is particularly important to lock down **write access** as much as possible.

- **Authentication**: Using basic authentication to communicate with DHIS2 from a DHIS2 application which already uses cookie session authentication is not recommended. Consider implementing the following:  
    - Leverage the existing user session (using a cookie in the browser) instead of basic authentication
    - If possible, perform all synchronization processes on the server-side instead of in the browser.  This is more secure and more performant but puts some onus on the server administrator to maintain an additional server-side service. 

- **XSS**: If your framework of choice can be configured to provide XSS protection, ensure that it is enabled. For example, React protects against XSS injection by default as long as [dangerouslySetInnerHTML](https://reactjs.org/docs/dom-elements.html#dangerouslysetinnerhtml) is not used.

- **Set `rel="noreferrer"` attribute on external links with `target="_blank"`**: When linking to external resources that should open in a new tab (using `target="_blank"`) ensure that the `rel="noreferrer"` attribute is set. This will prevent the external resource from being able to manipulate your page using `window.opener`. See this [short article](https://web.dev/external-anchors-use-rel-noopener/) for more information. 

- **Avoid externally hosted scripts and stylesheets**: External scripts and stylesheets, such as those served by global CDNs, should be avoided unless absolutely necessary - these can cause security and performance issues when accessed in various global contexts.

### Performance

Apps should run smoothly on widely available hardware and with a reasonable internet connection. Consider the following guidelines to make sure your app is available to a wide range of users:

-   Consider a range of desktop screen sizes. Approximately 75% of worldwide desktop and laptop users have a screen width below 1600px, so make sure your app doesn't need a wide screen.
-   Some users will have limited-resource hardware. If necessary, test your app with virtual limiting tools to check performance and usability on devices with limited memory and processing power.
-   Don't assume a stable or fast internet connection. If necessary, test your app with network throttling tools to see how a slow or intermittent connection affects the user experience. As much as possible, try to anticipate and allow for a wide range of network types and performances.

### Not allowed on the App Hub

Including any of the following will result in App Hub rejection or removal:

-   In-app advertisement.
-   Cryptocurrency mining.
-   Background downloads not initiated by the user.
-   Repackaged DHIS2 core apps.

### Submission Process

Upon submitting to the App Hub, the DHIS2 core team will review your app. Note that the core team does not have the resources to carry out extensive testing and bug reporting, this is the responsibility of the app author(s). Keep in mind the following points when you're ready to submit your app:

-   The review process will be quicker if your app is well-documented and follows the guidelines above.
-   Providing example use-cases and any example data/metadata are always helpful.
    If your app is rejected, the core team will let you know why, so make sure your contact details are up to date. You can resubmit your app after addressing any issues.
-   If your app is approved, it'll soon be available publicly on the App Hub. You can manage your app through your App Hub account.
