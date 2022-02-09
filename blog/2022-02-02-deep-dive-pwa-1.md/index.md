---
slug: 2022/01/ext-tech-blog-1
title: A deep-dive on a Progressive Web App implementation for a React-based App Platform (DHIS2)
author: Kai Vandivier
author_url: https://github.com/KaiVandivier
author_image_url: https://github.com/KaiVandivier.png
tags: [dhis2, health, java, javascript, react, pwa]
---

At [DHIS2](https://developers.dhis2.org) we're a team of fully remote developers working on the world's largest open-source health information management system, used by 73+ countries for collecting and analyzing health data. You can check our repos [here](https://github.com/dhis2), but basically, at the risk of oversimplifying things, we maintain a fully APIfied Java back-end [core project](https://github.com/dhis2/dhis2-core) and a series of core web apps built on top of a React based front-end technology that we call the [App Platform](https://github.com/dhis2/app-platform) supported by a design system with [custom UI components](https://github.com/dhis2/ui). We have advanced Analytics and an Android SDK too, but this post will focus on our front-end tech.

We are excited about the recent release of PWA features in our App Platform (more on this below), which you can read about in [this blog post introducing them](https://developers.dhis2.org/blog/2021/11/introducing-pwa), and we think the design challenges we faced in making these features generalizable to any app and the ways we used available technologies to solve those challenges are quite unique and interesting. So the purpose of this post is to share a bit of how we tackled the development process of this feature and provide a deeper understanding of how the PWA features work under the hood. We want to show you how we extended our platform to add the basic PWA features to DHIS2 apps and the decisions we made along the way to add installability, service worker compilation, offline caching strategies, and robust management of service worker updates and lifecycle.

<!--truncate-->

## Contents <!-- omit in toc -->

-   [DHIS2 App Platform](#dhis2-app-platform)
    -   [The App Platform at build-time](#the-app-platform-at-build-time)
    -   [The App Platform at run-time](#the-app-platform-at-run-time)
    -   [The App Platform orchestra](#the-app-platform-orchestra)
-   [Into Progressive Web Apps (PWA)](#into-progressive-web-apps-pwa)
    -   [Adding installability](#adding-installability)
    -   [Adding simple offline capability](#adding-simple-offline-capability)
        -   [Creating a service worker script to perform offline caching](#creating-a-service-worker-script-to-perform-offline-caching)
        -   [Compiling the service worker and adding it to the app](#compiling-the-service-worker-and-adding-it-to-the-app)
        -   [Registering the service worker from the app if PWA is enabled in the app’s config](#registering-the-service-worker-from-the-app-if-pwa-is-enabled-in-the-apps-config)
        -   [Managing the service worker’s updates and lifecycle](#managing-the-service-workers-updates-and-lifecycle)
            -   [Perfecting the user experience of updating PWA apps](#perfecting-the-user-experience-of-updating-pwa-apps)
            -   [Implementation of the app update flow](#implementation-of-the-app-update-flow)
                -   [Registration of the service worker](#registration-of-the-service-worker)
                -   [Handling app updates with a "PWA update manager" component](#handling-app-updates-with-a-pwa-update-manager-component)
            -   [Handling precached static assets between versions](#handling-precached-static-assets-between-versions)
            -   [Adding a kill switch for a rogue service worker](#adding-a-kill-switch-for-a-rogue-service-worker)
-   [Conclusion](#conclusion)

Let's start then with some necessary context about how our App Platform works.

## DHIS2 App Platform

DHIS2's live production instances are implemented at the national level in [70+ countries](https://dhis2.org/in-action/) and are used for many purposes, for example tracking health facility resources, tracking and visualizing Malaria cases, and supporting COVID-19 inmunization campaigns. Each DHIS2 instance usually has specific requirements, so we wanted to make it really easy for DHIS2 developers to [contribute extensions as web apps](https://apps.dhis2.org) (and make our lives easier when creating and maintaining [our own 26+ core web apps](https://github.com/search?q=org%3Adhis2+-app&type=repositories)!). Enter the [App Platform](https://github.com/dhis2/app-platform). The App Platform is a unified application architecture and build pipeline to simplify and standardize application development within the DHIS2 ecosystem. If you take a look at the image below you should note that we provide almost everything in there for you (common/instance UI, data access and build tooling) and you just need to code your app's fundamentals (basically your App's interface, state management and data visualization):

![App Platform](https://user-images.githubusercontent.com/246555/150789100-ed368e7b-934b-49a2-a2b2-ae7d15bb5b51.png)
[More info about App Platform](https://docs.google.com/presentation/d/1tzYfmuurCfRNWtJjdOeQXJ2uiPTZsxE4WpV0_0XTw9E/edit#slide=id.g5b783f7689_0_0)

This way DHIS2 developers can focus on the app's distinct functionality without having to worry about the nitty gritty details such as authentication, data access, i18n support, etc.

### The App Platform at build-time

The App Platform is made up of a number of build-time components and development tools that you can find in our [`app-platform` repository](https://github.com/dhis2/app-platform/):

1. An **App Adapter** which is a wrapper for the app under development – it wraps the root component exported from the app’s entry point (like `<App />`) and performs other jobs.
2. An **App Shell** which provides the HTML skeleton for the app and other assets, imports the root `<App>` component from the app under development’s entry point, and wraps it with the App Adapter (and provides some environment variables to the app).
3. An **App Scripts CLI** (part of [d2 global CLI](https://cli.dhis2.nu/#/)) which provides development tools and performs build-time jobs such as building the app itself and running a development server (among other features like spinning up DHIS2 server containers).

### The App Platform at run-time

At run-time, our platform offers React components and hooks that provide services to the app under development. These are mainly two elements:

1. The **[App Runtime](https://runtime.dhis2.nu)** that depends on a universal `<Provider>` component to provide context (provided normally by the App Adaper) and exposes the following services:
    1. A **Data Service** that publishes a declarative API for sending and receiving data to and from the DHIS2 back-end
    2. A **Config Service** that exposes several app configuration parameters
    3. An **Alerts Service** that provides a declarative API for showing and hiding in-app alerts (which works with the Alerts manager component in the App Adapter to show the UI)
2. A **UI Library** that offers reusable interface components that implement the DHIS2 design system. See more at the [UI documentation](https://ui.dhis2.nu) and the [`ui` repository](https://github.com/dhis2/ui).

### The App Platform orchestra

To illustrate how the App Adapter, App Shell, and App Scripts CLI work together, consider this series of events that takes place when you initialize and build an app:

1. Using the [d2 global CLI](https://cli.dhis2.nu/#/) (which includes the App Scripts CLI mentioned above), a new Platform app is [bootstrapped](https://platform.dhis2.nu/#/bootstrapping) using `d2 app scripts init new-app` in the terminal.
2. Inside the `new-app/` directory that the above script just created, the `yarn build` command is run which in turn runs [`d2-app-scripts build`](https://platform.dhis2.nu/#/scripts/build), which initiates the following steps. Any directory or file paths described below are relative to `new-app/`.
3. i18n jobs are executed (out of scope for this post).
4. The `build` script creates a new app shell in the `.d2/shell/` directory.
5. A web app manifest is generated.
6. The app code written in `src/` is transpiled and copied into the `.d2/shell/src/D2App/` directory.
7. Inside the shell at this stage, the files are set up so that the root component exported from the "entry point" in the app under development (`<App />` from `src/App.js` by default, now copied into `.d2/shell/src/D2App/App.js`) is _imported_ by a file in the shell [that wraps it with the App Adapter](https://github.com/dhis2/app-platform/blob/master/shell/src/App.js), and then the [wrapped app gets rendered](https://github.com/dhis2/app-platform/blob/master/shell/src/index.js) into an anchor node in the DOM.
8. The shell-encapsulated app that's now set up in the `.d2/shell/` directory is now basically a "Create React App" app, and `react-scripts` can be used to compile a minified production build. The `react-scripts build` script is run, and build is output to the `build/app/` directory in the app root.
9. A zipped bundle of the app is also created and output to `build/bundle/`, which can be uploaded to a DHIS2 instance.

## Into Progressive Web Apps (PWA)

Now that you have some background on our apps architecture and platform, let's talk about our implementation of Progressive Web Apps (“PWA”) and how it presented several design challenges as we required it to be generalizable to any app. We wanted our App Platform based web apps to support two defining features which are core to PWAs:

-   **Installability**, which means the app can be downloaded to a device and run like a native app, and
-   **Offline capability**, meaning the app can support most or all of its features while the device is offline. This works when the app is opened in a browser or as an installed app.

Adding PWA features, especially offline capability, in the DHIS2 App Platform is a large task -- implementing PWA features can be complex enough in a single app (with some aspects being [_famously_ tricky](https://developers.google.com/web/fundamentals/primers/service-workers/lifecycle)), and on top of that, we have some other unique design criteria that add complexity to our project:

-   The features should work in and be easy to add to _any_ Platform app,
-   They should support our Dashboard app’s unique “cacheable sections” use-case (described in our [PWA intro blog](https://developers.dhis2.org/blog/2021/11/introducing-pwa), basically enabling the saving of individual dashboards in the offline cache while leaving other dashboards uncached) in a way that can be generalized to any other app, and
-   They should not cause side effects for apps that _don’t_ use the PWA features.

For now we'll cover installability and simple offline capability; cacheable sections are more complex and face numerous particular design challenges, and they will be described in another deep-dive post (stay tuned to [DHIS2 developer's blog](https://developers.dhis2.org/blog)).

### Adding installability

This is the simplest PWA feature to add; all that’s needed is a [PWA web manifest](https://web.dev/add-manifest/) file which adds metadata about the web app so that it can be installed on a device, then to link to it from the app’s `index.html` file like so:

```html
<link
    rel="manifest"
    crossorigin="use-credentials"
    href="%PUBLIC_URL%/manifest.json"
/>
```

In the App Platform, this is implemented by extending the “manifest generation” step of the App Scripts CLI `build` script ([step 5](#the-app-platform-orchestra) in the example build sequence above). The script accesses the app’s config from `d2.config.js` and generates a `manifest.json` file with the appropriate app metadata (including name, description, icons, and theme colors), then writes that `manifest.json` to the resulting app’s `public/` directory, which would be `.d2/shell/public/`. You can take a peek at the manifest generation source code in the App Scripts CLI [here](https://github.com/dhis2/app-platform/blob/master/cli/src/lib/generateManifests.js).

Then, the App Shell package contains the `index.html` file that the app will use, so that’s where the link to the `manifest.json` file [will be added](https://github.com/dhis2/app-platform/blob/1d0423e135b71d2005198287075e47d939040049/shell/public/index.html#L14-L18).

All Platform apps generate a PWA web manifest, even if PWA is not enabled, but this alone will not make the app installable. A service worker with a ‘fetch’ handler must be registered too, which is rather complex and described below.

### Adding simple offline capability

Basic offline capability is added to the platform by adding a **service worker** to the app. A service worker is a script that installs and runs alongside the app and has access to the app’s network traffic by listening to `fetch` events from the app and handling what to do with the requests and responses it receives.

The service worker can maintain offline caches with data that the app uses. Then, when the user’s device is offline and the app makes a `fetch` event to request data, the service worker can access the response to that request from the offline cache instead of the network. This allows the app to work offline. You can read more about the basics of service workers [here](https://developers.google.com/web/fundamentals/primers/service-workers); the following sections assume some knowledge about the basics of how they work.

Implementing the service worker in the app platform takes several steps:

1. Creating a service worker script to perform offline caching
2. Compiling the service worker and adding it to the app
3. Registering the service worker from the app if PWA is enabled in the app’s config
4. Managing the service worker’s updates and lifecycle

#### Creating a service worker script to perform offline caching

We use the [Workbox](https://developers.google.com/web/tools/workbox) library and its utilities as a foundation for our service worker to provide the offline caching basics.

There are a few different strategies that can be used for caching data offline which balance performance, network usage, and data ‘freshness’, and we settled on these to provide basic offline functionality in Platform apps:

1. Static assets that are part of the built app (javascript, CSS, images, and more) are **precached**.
2. Data that’s requested during runtime always uses the network with a combination of a **stale-while-revalidate** strategy for fetched static assets and a **network-first** strategy for API data.

If you want to read more about our decisions to use these strategies, they are explained in more depth in our [first PWA blog post](https://developers.dhis2.org/blog/2021/11/introducing-pwa#what-youll-get-with-offline-caching), but basically we're looking for the sweet spot of performance vs. freshness.

#### Compiling the service worker and adding it to the app

An implementation constraint for service workers is that they must be a single, self-contained file when they are registered by the app to get installed in a user’s browser, which means all of the service worker code and its dependencies must be compiled into a single file at build time.

Our service worker depends on several external packages _and_ is [split up among several files](https://github.com/dhis2/app-platform/tree/master/pwa/src/service-worker) to keep it in digestible chunks before being [imported in the App Shell](https://github.com/dhis2/app-platform/blob/master/shell/src/service-worker.js), so we need some compilation tools in the Platform.

Workbox provides a [Webpack plugin](https://developers.google.com/web/tools/workbox/modules/workbox-webpack-plugin) that can compile a service worker and then output the production build to the built app. Our build process takes advantage of Create React App(CRA)’s `build` script for the main compilation step once the app under development has been injected into an App Shell (recall [the build process outlined in the App Platform section above](#the-app-platform-orchestra)), and CRA happens to be configured out-of-the-box to use the Workbox-Webpack plugin to compile a service worker in the CRA app’s `src/` directory and output it in the built app’s `public/` directory, so most of our compilation needs are met by using CRA.

The Workbox-Webpack plugin _also_ injects a **precache manifest** into the compiled service worker, which is a list of the URLs that the service worker will fetch and cache upon installation (recall the precaching strategy described in the [previous section](#creating-a-service-worker-script-to-perform-offline-caching)). The plugin uses the list of minified static files that Webpack outputs from the build process to make this manifest, which covers the app’s javascript and CSS chunks as well as the `index.html` file, but these do not cover _all_ of the static assets in the app’s `build` directory. Files like icons, web manifests, and javascript files from vendors like `jQuery` need to be handled separately.

To add those remaining files to the precache manifest, we add another step to _our_ CLI’s build process, after executing the CRA build step, that uses the [`injectManifest`](https://developers.google.com/web/tools/workbox/modules/workbox-build#injectmanifest_mode) function from the [`workbox-build`](https://developers.google.com/web/tools/workbox/modules/workbox-build) package to read all of the other static files in the app’s `build` directory (i.e. excluding the minified JS and CSS files and `index.html` that the Workbox-Webpack plugin handled), generate a manifest of those URLs, and inject _that_ list into the compiled service worker at a prepared placeholder. You can see the resulting `injectManifest` code [here](https://github.com/dhis2/app-platform/blob/master/cli/src/lib/pwa/injectPrecacheManifest.js).

Handling these precache manifests correctly is also important for keeping the app up-to-date, which will be described in the [“Managing the service worker’s updates and lifecycle” section](#managing-the-service-workers-updates-and-lifecycle) below.

#### Registering the service worker from the app if PWA is enabled in the app’s config

To implement the opt-in nature of the PWA features, the service worker should only be registered if PWA is enabled in the app’s [configuration](https://platform.dhis2.nu/#/config). We added an option to the [`d2.config.js` app config file](https://platform.dhis2.nu/#/config/d2-config-js-reference) that can enable PWA, which looks like this:

```diff title="d2.config.js"
module.exports = {
    type: 'app',
    title: 'My App',

+   pwa: { enabled: true },

    entryPoints: {
        app: './src/App.js',
    },
}
```

During the `d2-app-scripts` `start` or `build` processes, the config file is read, and a `PWA_ENABLED` value is added to the app’s environment variables. Then, in the App Adapter’s initialization logic, it registers or unregisters the service worker based on the the `PWA_ENABLED` environment variable.

#### Managing the service worker’s updates and lifecycle

Managing the service worker’s [lifecycle](https://developers.google.com/web/fundamentals/primers/service-workers/lifecycle) is both complex and vitally important. Because the core assets that run the app are precached and served directly from the cache without contacting the server, in order for a client to use newly deployed app updates, the service worker must be updated with a new precache manifest.

If the service worker lifecycle and updates are managed poorly, the app can get stuck on an old version in a user’s browser and never receive updates from the server, which can be hard to diagnose and harder to fix. The [“Handling precached static assets between versions” section](#handling-precached-static-assets-between-versions) below explains more about why that happens.

This can be a famously tricky problem, and we think we’ve come across a robust system to handle it which we’ll describe below.

##### Perfecting the user experience of updating PWA apps

Managing SW updates is complex from a UX perspective: updating the service worker to activate new app updates in production requires a page reload (for reasons described below), which shouldn’t happen without a user’s consent because reloads can cause loss of unsaved data; but we also want the user to use the most up-to-date version of the app possible. Therefore, it poses a UX design challenge to notify and persuade users to reload the app to use new updates as soon as possible, and at the same time avoid any dangerous, unplanned page reloads.

The UX design we settled on is this:

1. Once a new service worker is installed and ready, either on first installation or as an update to an existing one, a prompt is shown to the user that says “There’s an update available for this app” with two actions: “Update now” and “Not now”.

!["There's an update available" alert](update-available-alert.png)

2. When the user clicks “Update now”, if one tab of the app is open, the page will reload. If _more_ than one tab is open, the app will show a confirmation modal that warns the user that all the open tabs of the app will reload, which will cause loss of unsaved data, and has actions to continue or cancel.

![Reload confirmation modal](reload-confirmation-modal.png)

3. If the user clicks “Not now”, the prompt will close and wait for the user to reload the page. If this is the first time a SW is installing for the app, it will go ahead and activate after the reload, but if this is an update to an existing SW, the “Update” prompt will be shown again.
4. If this is an update to an existing SW and the user _never_ clicks “Update now”, the SW will eventually activate when a new instance of the app is opened after all previous tabs of the app have been closed. This is how browsers natively handle SW updates without any intervention, but this case should be avoided because it may result in delays of important app updates.

##### Implementation of the app update flow

Implementing this update flow in the App Platform requires several cooperating features and lots of logic behind the scenes in the service worker code, the client-side SW registration functions, and the React-level UI.

To simplify communicating with the service worker from the React environment and abstract away usage of the `navigator.serviceWorker` APIs, we made an [Offline Interface object](https://github.com/dhis2/app-platform/blob/1d0423e135b71d2005198287075e47d939040049/pwa/src/offline-interface/offline-interface.js#L22) that handles event-based communication with the service worker and exposes easier-to-use methods for registration and update operations. It also provides some functions that serve cacheable sections and complex offline capability which will be described in more detail in a follow up PWA blog post (stay tuned to [DHIS2 developer's blog](https://developers.dhis2.org/blog)).

Our service worker registration functions draw much from the Create React App PWA Template [registration boilerplate](https://github.com/cra-template/pwa/blob/master/packages/cra-template-pwa/template/src/serviceWorkerRegistration.js), which includes some useful logic like checking for a valid SW, handling development situations on localhost, and some basic update-checking procedures. These features are a useful starting place, but our use-case requires more complexity, which leads to the additions described below.

###### Registration of the service worker

If PWA is enabled, a [`register()` function](https://github.com/dhis2/app-platform/blob/10a9d15efc4187865f313823d5d1218824561fcd/pwa/src/lib/registration.js#L112) is [called](https://github.com/dhis2/app-platform/blob/10a9d15efc4187865f313823d5d1218824561fcd/pwa/src/offline-interface/offline-interface.js#L24-L30) when an Offline Interface object is [instantiated in the App Adapter](https://github.com/dhis2/app-platform/blob/10a9d15efc4187865f313823d5d1218824561fcd/adapter/src/index.js#L8) while the app is loading. The `register()` function listens for the `load` event on the `window` object before calling `navigator.serviceWorker.register()`, because the browser checks for a new service worker upon registration, and if there is one, the service worker will install and download the assets it needs to precache. The installation and downloads may be resource-intensive and affect the page load performance, so the registration and thus installation is delayed until after the window `load` event.

The Offline Interface also [registers a listener](https://github.com/dhis2/app-platform/blob/10a9d15efc4187865f313823d5d1218824561fcd/pwa/src/offline-interface/offline-interface.js#L36-L46) to the `controllerchange` event on `navigator.serviceWorker` that will reload the page when a new service worker takes control, i.e. starts handling fetch events. This is to make sure the app loads by using the latest assets that the new service worker just installed.

Unlike some implementations, our service worker is designed to wait patiently once it installs. After it installs and activates for the first time, it does not ‘claim’ the open clients, i.e. take control of those pages and start handling fetch events by using the `clients.claim()` API; instead it waits for the page to reload before taking control. This design ensures that a page is only ever controlled during its lifetime by _one_ service worker or _none_; a reload is required for a service worker to take control of a page that was previously uncontrolled or to take over from a previous one. This makes sure the app only uses the core scripts and assets from _one_ version of the app due to precaching. The service worker also does not automatically ‘skip waiting’ and take control of a page when a new update has installed; it will continue waiting for a signal from the app or for the default condition described in [part 4 of the UX flow above](#user-experience). What the SW _does_ is to [listen for messages](https://github.com/dhis2/app-platform/blob/10a9d15efc4187865f313823d5d1218824561fcd/pwa/src/service-worker/service-worker.js#L187-L196) from the client instructing it to ‘claim clients’ or ‘skip waiting’ in response to the user’s actions and depending on the circumstance, which looks like this:

```js
self.addEventListener('message', (event) => {
    if (event.data.type === 'CLAIM_CLIENTS') {
        // Calls clients.claim() and reloads all tabs:
        claimClients()
    }
    if (event.data.type === 'SKIP_WAITING') {
        self.skipWaiting()
    }
})
```

Below you can see more details about these messages.

###### Handling app updates with a "PWA update manager" component

At the top level, the update flow is controlled by a [PWA update manager component](https://github.com/dhis2/app-platform/blob/1d0423e135b71d2005198287075e47d939040049/adapter/src/components/PWAUpdateManager.js#L53) that's [rendered in the App Adapter](https://github.com/dhis2/app-platform/blob/1d0423e135b71d2005198287075e47d939040049/adapter/src/components/AppWrapper.js#L30) and is supported by the Offline Interface. The code for the component, which we'll walk through below, looks like this -- notice the `confirmReload()` function, the `useEffect` hook, and the `ConfirmReloadModal` that's rendered:

```jsx
export default function PWAUpdateManager({ offlineInterface }) {
    const [confirmReloadModalOpen, setConfirmReloadModalOpen] = useState(false)
    const [clientsCountState, setClientsCountState] = useState(null)
    const { show } = useAlert(
        i18n.t("There's an update available for this app."),
        ({ onConfirm }) => ({
            permanent: true,
            actions: [
                { label: i18n.t('Update and reload'), onClick: onConfirm },
                { label: i18n.t('Not now'), onClick: () => {} },
            ],
        })
    )

    const confirmReload = () => {
        offlineInterface
            .getClientsInfo()
            .then(({ clientsCount }) => {
                setClientsCountState(clientsCount)
                if (clientsCount === 1) {
                    // Just one client; go ahead and reload
                    offlineInterface.useNewSW()
                } else {
                    // Multiple clients; warn about data loss before reloading
                    setConfirmReloadModalOpen(true)
                }
            })
            .catch((reason) => {
                // Didn't get clients info
                console.warn(reason)
                // Go ahead with confirmation modal with `null` as clientsCount
                setConfirmReloadModalOpen(true)
            })
    }

    useEffect(() => {
        offlineInterface.checkForNewSW({
            onNewSW: () => {
                show({ onConfirm: confirmReload })
            },
        })
    }, [])

    return confirmReloadModalOpen ? (
        <ConfirmReloadModal
            onConfirm={() => offlineInterface.useNewSW()}
            onCancel={() => setConfirmReloadModalOpen(false)}
            clientsCount={clientsCountState}
        />
    ) : null
}
```

By using the `useEffect` hook with an empty dependency array, upon first render the update manager checks for new service workers by calling the Offline Interface's [`checkForNewSW()` method](https://github.com/dhis2/app-platform/blob/10a9d15efc4187865f313823d5d1218824561fcd/pwa/src/offline-interface/offline-interface.js#L61-L65) (and by extension the [`checkForUpdates()` registration function](https://github.com/dhis2/app-platform/blob/1d0423e135b71d2005198287075e47d939040049/pwa/src/lib/registration.js#L1-L75)). `checkForUpdates()` checks for service workers installed and ready, listens for new ones becoming available, and checks for installing service workers between those states. Given the several steps of the SW lifecycle (installing, installed, activating, activated), multiple SWs present in the [SW registration object](https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration) (installing, waiting, active), and the fact that sometimes the ‘active’ SW is not in _control_ because it’s the first SW installation for this app, a good amount of condition-checking is necessary to determine if a new service worker is ready and waiting to take over the open tabs. For the full control flow, take a look at the `checkForUpdates()` source code linked above.

If there _is_ a new SW ready, then the `onNewSW()` callback function provided to `checkForNewSW()` is called, which shows the "Updates are available" alert. If a user clicks the "Update now" action on the alert, the `confirmReload()` function is called, which handles the next part of the update flow by checking for how many tabs of this app are open in order to handle the “one-client” or “multiple-client” conditions described in the UX flow above. It uses the Offline Interface's [`getClientsInfo()` method](https://github.com/dhis2/app-platform/blob/10a9d15efc4187865f313823d5d1218824561fcd/pwa/src/offline-interface/offline-interface.js#L67-L89), which ‘asks’ the ready SW how many clients are associated with this domain and returns a promise that resolves to the correct data (or rejects with a failure reason that can be handled).

Once the clients info is received, if there is one client open for this service worker scope, `confirmReload()` will use the Offline Interface’s [`useNewSW()` method](https://github.com/dhis2/app-platform/blob/10a9d15efc4187865f313823d5d1218824561fcd/pwa/src/offline-interface/offline-interface.js#L91-L112) to instruct new SW to activate or take control. The `useNewSW()` method detects if this new SW is the first one that has installed for this app or an update to an existing SW and handles the situations accordingly, either sending a ‘claim clients’ message to a first-install SW, or a ‘skip waiting’ message to an updated SW. Both actions inside the service worker result in a `controllerchange` event in open clients, which triggers a page reload because of the event listener the Offline Interface registered on `navigator.serviceWorker` that was described above.

If there are multiple clients open (or if the `getClientsInfo()` request fails), then the [`ConfirmReloadModal` dialog](https://github.com/dhis2/app-platform/blob/1d0423e135b71d2005198287075e47d939040049/adapter/src/components/PWAUpdateManager.js#L14-L44) is rendered that warns the user that _all_ open tabs of the app will be reloaded if they continue, and they will lose any unsaved data. If a number of clients _was_ returned by `getClientsInfo()`, that number is shown in the warning dialog to remind the user about open tabs that might be have forgotten about across multiple windows or on a mobile device for example. If the user clicks the ‘Reload’ action, the `useNewSW()` method is called and the open pages will reload as a result.

All these steps under the hood are coordinated to create the robust [user experience](#user-experience) described above and make sure service workers and apps update correctly.

There is another improvement we could make to the update flow to help ensure the app is as up-to-date as possible, which we may implement in the future to handle the case where a user repeatedly dismisses the ‘Update’ prompt and never closes all of their open tabs. When the app is loading, before any UI loads, an update manager can check if there is a new update already fully ready and waiting. If there is one, _and_ there is only one tab open, the update manager can use the `useNewSW()` method before the app UI loads and reload the page, which would activate the new updates without causing an unexpected reload while the app is in use.

##### Handling precached static assets between versions

As mentioned in the [“Compiling the service worker” section](#compiling-the-service-worker-and-adding-it-to-the-app) above, when using precaching for app assets, there are several considerations that should be handled correctly with respect to app and service worker updates. Conveniently, these best practices are handled by the Workbox tools (the Webpack plugin and the `workbox-build` package) introduced earlier.

Both of these Workbox tools make sure each manifest entry has _revision_ information in the URL by hashing the contents of that file and adding the hash to the file’s URL, which helps the app use assets that are as up-to-date as possible. Since precached assets will be served directly from the cache without accessing the network, new app updates will never be accessed until the _service worker itself_ updates and downloads new assets based on the new precache manifest. Service workers only update if the registered service worker file is byte-different from the file of the same name on the server, so by adding a revision hash to the URLs in the precache manifest, app assets changing will also cause the contents of the service worker to change by changing the URLs in the precache manifest. Even if the rest of the service worker code is the same, the service worker can update and serve the new assets.

You can read more about precaching with Workbox at the [Workbox documentation](https://developers.google.com/web/tools/workbox/modules/workbox-precaching).

##### Adding a kill switch for a rogue service worker

If, for some reason, the service worker lifecycle gets out of control and an app gets stuck with a service worker serving old app assets from the cache and blocking any updates that have been deployed to the server, that can be a difficult problem to fix. It’s a problem we’ve faced with some of the DHIS2 core apps: an old version of the app once registered a service worker and served the app assets via a precaching strategy, but when a new version of the app was deployed _without a service worker_, there was no way for the newly deployed app to take over from the previous version. It would seem like the app was stuck on an old version and missing new fixes, even though a new version had been deployed to the server.

To handle this “rogue service worker” case, we added a **kill-switch mode** to the service worker in the platform which will help unstick apps with a SW that’s serving an old version of the app. This takes advantage of browsers’ service worker update design: in response to a registration event or a navigation in scope of an active service worker, the browser will check the server for a new version of the service worker with the same filename, even if that service worker is cached. If there is a SW on the server and it is byte-different from the active one, the browser will initiate the installation process of the new SW on the server (this was relevant to the update process described above as well).

To take advantage of that process, _every_ Platform app actually gets a compiled service worker called `service-worker.js` added to the built app whether or not PWA is enabled, and the service worker behaves differently depending on the app configuration (and only gets _registered_ if PWA is enabled). If PWA is _not_ enabled, the service worker behaves in the [kill-switch mode](https://github.com/dhis2/app-platform/blob/10a9d15efc4187865f313823d5d1218824561fcd/pwa/src/service-worker/utils.js#L25-L46), which uses this code:

```js
/** Called if the `pwaEnabled` env var is not `true` */
export function setUpKillSwitchServiceWorker() {
    // A simple, no-op service worker that takes immediate control and tears
    // everything down. Has no fetch handler.
    self.addEventListener('install', () => {
        self.skipWaiting()
    })

    self.addEventListener('activate', async () => {
        console.log('Removing previous service worker')
        // Unregister, in case app doesn't
        self.registration.unregister()
        // Delete all caches
        const keys = await self.caches.keys()
        await Promise.all(keys.map((key) => self.caches.delete(key)))
        // Delete DB
        await deleteSectionsDB()
        // Force refresh all windows
        const clients = await self.clients.matchAll({ type: 'window' })
        clients.forEach((client) => client.navigate(client.url))
    })
}
```

It will skip waiting as soon as it’s done installing to claim all open clients, and upon taking control, will unregister itself, delete all caches (and a "sections" IndexedDB that will be introduced in a follow-up post about cacheable sections), then reload the page. After this reload, the service worker will be inactive, and the new app assets will be fetched from the server instead of served by the offline cache, allowing the app to run normally.

By including this kill-switch mode, we prevent apps from getting stuck in the future _and_ we unstick apps that have been stuck in the past, like the core apps mentioned above.

## Conclusion

We hope you enjoyed this introduction to the DHIS2 App Platform and how we added foundational PWA features to it, including installability, build tooling to read an app’s config and compile a service worker, caching strategies, and service worker updates and lifecycle management. Hopefully this closer look is interesting for its technical design and is helpful for a deeper understanding of how these features work together to enable offline capability in DHIS2 apps.

A note of warning: In our current PWA implementation, cached data is not encrypted when stored offline, and a malicious actor could inspect access and inspect the cached data if they gain access to a user’s device. For this reason, it is highly recommended to take additional security steps when using PWA features in an app that will handle sensitive data, especially if the app is likely to be used on shared devices. Some protections are currently provided by the platform to guard against unauthorized access to data when a user logs out or when a new user logs in, but without encryption it might still be possible for a savvy attacker to access some offline data. Importantly, the data can only be accessed by someone with direct access to a browser which has been used to log in and download data for offline use.

Encryption of offline data will be the next feature for these PWA tools however, so keep an eye out for the announcement of that release.

In a follow-up post we'll describe design challenges and solutions for creating the “cacheable sections” and some other App Runtime features that were described in the [PWA introduction blog post](https://developers.dhis2.org/blog/2021/11/introducing-pwa) (stay tuned to [DHIS2 developer's blog](https://developers.dhis2.org/blog) and our [dev.to landing page](https://dev.to/dhis2)).

Is there anything you’d like to know more about on this subject, or have any other questions or comments? Feel free to reach out to us via [e-mail](mailto:community@dhis2.com), [Slack](https://dhis2-dev-community.slack.com), [Twitter](https://twitter.com/dhis_2) or our [Community of Practice](https://community.dhis2.org/c/development/10)! We’re always happy to hear from interested developers and community members. If you would like to join our team to tackle challenges like the PWA implementation please check our [careers section](https://dhis2.org/careers) in our website (we now have several remote friendly tech openings that might interest you including front-end and back-end developer roles).
