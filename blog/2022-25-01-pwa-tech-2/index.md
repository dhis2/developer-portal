#### “Cacheable Sections” and Complex Offline Capability

As mentioned in the “Introducing PWA” post, to support the Dashboard app to save individual dashboards offline, we created a React API that’s exported from the [`@dhis2/app-runtime` package](https://runtime.dhis2.nu/) that can capture and cache the data required for a contentful component, e.g. a dashboard. 

The Dashboard app faces an unusual circumstance that shapes the design of this API: the app itself doesn’t know all of the data requirements of the items in the dashboard, because various plugins will load as part of the dashboard and will make their own data requests that are outside of the control of the parent app. To capture and cache those unkown data requirements, we designed the API to communicate with service worker to enter a “recording mode”, and, while reloading the component, the SW will listen to all network requests that are issued from the client and cache them as a part of that section’s cache. We call these **cacheable sections**.

The React API consists of two main features: 

1. A [`useCacheableSection(id)` hook](https://runtime.dhis2.nu/#/advanced/offline?id=usecacheablesection-api) that receives a section ID as an argument and returns some information and controls for that section, including a `startRecording` function that initiates the “recording mode”, and 
2. A [`CacheableSection` component](https://runtime.dhis2.nu/#/advanced/offline?id=cacheablesection-api) that wraps the component that will be “cacheable” and receives an ID prop that should match the section ID of a `useCacheableSection` hook that will control it.

Using these together to make a part of the app cacheable would look like this:

```jsx
import { useCacheableSection, CacheableSection } from '@dhis2/app-runtime'
import { Button } from '@dhis2/ui'
import { Dashboard } from './dashboard.js'
import { LoadingMask } from './loading-mask.js'

export function CacheableDashboard({ id }) {
    const { startRecording } = useCacheableSection(id)
    
    return (
    	<>
        	<Button onClick={() => startRecording()}>
            	Make available offline
        	</Button>
        	<CacheableSection id={id} loadingMask={<LoadingMask />}>
            	<Dashboard id={id} />
        	</CacheableSection>
        </>
    )
}
```

##### Making sure content in cacheable sections doesn’t get cached until recorded

Part of the design challenge for cacheable sections is to cache all the data the app needs to run and *exclude* the content in cacheable sections during normal runtime operation, so that the content is only cached when a user requests to make that section available offline. This spares the user’s offline storage space from content they don’t need, like dashboards that aren’t important to a specific trip into a network-limited area. Also, a user may have *many* dashboards, and it’s not feasible to cache them all at once.

An ideal solution might involve knowing the data dependencies for all the components in a cacheable section, then omitting those requests and responses from the app’s normal caching behavior and fetching & caching them when the user requests that content to be saved offline. But as mentioned above, the Dashboard app does not know all the data that a dashboard needs, so it can’t know what to cache and what not to cache.

To solve this problem, we arrived upon a configurable filter that can omit requests for URLs that match a list of developer-supplied patterns. That is, when a developer is configuring an app’s caching settings in `d2.config.js`, they can provide a list strings or regular expressions that will be checked everytime data is fetched outside of recording mode; if the URL of the request matches a pattern from that filter list, it won’t be cached. For the Dashboard app, that setting might look like this:

```jsx
// d2.config.js

const config = {
    // ...other options
    pwa: {
        enabled: true,
        caching: {
            patternsToOmitFromAppShell: [
                'dashboards/[a-zA-Z0-9]*',
                'visualizations',
                'analytics',
                'geoFeatures',
                'cartodb-basemaps-a.global.ssl.fastly.net',
            ],
        },
    },
}
module.exports = config
```

*Note here that the setting is called `patternsToOmitFromAppShell`. “App shell” here is used in the PWA context, meaning “the scripts, assets, and API data that are required to run the core functionality of the app”, not to be confused with the `@dhis2/app-shell` package mentioned in the App Platform section at the top of this article that is the common wrapper that encapsulates DHIS2 Platform apps.*

There are a few other caching configuration options that are available for other use cases that you can read more about [here](https://platform.dhis2.nu/#/pwa/pwa?id=opting-in).

##### How the Cacheable Sections work

###### Recording mode in the service worker

When the `startRecording` function is called from the `useCacheableSection` hook, a message is sent to the service worker to enter “recording mode” (more on messaging below). It sets up a recording state for the client that sent the message [link to function?], including a flag that indicates that requests should be recorded for this client. Then the SW sends a message back to the client indicating that it’s ready to record, and it expects the app to reload the component of interest to trigger all the requests that component needs.

After that point, any fetch events that the SW receives are handled by recording mode handlers instead of the handlers that provide the normal caching strategies described in “Basic offline capability” above.

Requests are fetched over the network, and a list of the pending requests is tracked. Whenever a response is received, the response is saved in a temporary cache using the [`CacheStorage` API](https://developer.mozilla.org/en-US/docs/Web/API/CacheStorage) and the corresponding request is removed from the list of pending requests. To capture the “cascade” of requests that may be triggered by a component like a dashboard that loads plugins that make further requests once they load, the service worker starts a timer when there are no more pending requests to wait for further requests. If no more requests are received by the SW before the timer runs out, the recording session ends and is cleaned up; but if any other requests are received, then the timer is cleared and the recording continues until this process repeats the next time the list of pending requests is empty. When the recording session is cleaned up, the cached responses are moved from the temporary cache to a cache indexed by the ID of the cacheable section, the SW returns to using the normal caching strategies to handle fetch events, and the recording state for that client is cleared.

If any errors occur during this process, for example if a `fetch` call throws an error in one of the requests, the recording session will stop, the temporary cache will be cleared, and an error message will be sent to the client. This prevents failed recordings from writing over data from successful recordings.

You may notice that the “cascade” of requests that a cacheable section might trigger and the length of a pause between cascading requests depends on a user’s device performance and will therefore vary. To handle these differences, the length of the timeout before stopping recording is configurable and can be extended. The default value is 1 second in the service worker, but the ‘start recording’ message sent to the service worker can include a `recordingTimeoutDelay` in its payload that overrides the default. The `startRecording` function returned by the `useCacheableSection` hook accepts a `recordingTimeoutDelay` option and takes advantage of this interface.

Only one recording per client is permitted at a time in this implementation since our use case does not require recording multiple sections at a time.

See the resulting source code for recording mode in the service worker [here](https://github.com/dhis2/app-platform/blob/master/pwa/src/service-worker/recording-mode.js).

###### Accessing cached sections while offline

Once a cacheable section is saved offline, if its content was filtered out of the normal caching strategies as above in the “Making sure content in cacheable sections doesn’t get cached until recorded” [todo: link] section above, another request handler is necessary to add alongside the previous Workbox handlers and the “recording mode” handler.

This strategy handler should be used as the default for any request that fit the “matching” criteria of the other handlers, and it should act a bit like a “network-first” strategy. The handler should first try to fetch the data for the request it’s handling over the network. If the request is successful, it returns the response *without* caching it, which is how it differs from a network-first strategy. If the response over the network fails, then the handler should check for a response for that request in the offline caches and serve that if possible, the same way a network-first strategy would.

This strategy allow the service worker to serve up content from cached sections; you can see the resulting code for this handler [here](https://github.com/dhis2/app-platform/blob/2b17e60bea02dd9c4e6b441eeff36ffabea44996/pwa/src/service-worker/service-worker.js#L156-L174).

###### Using the offline interface

Enabling the “recording mode” feature requires some coordination between the React API and the service worker in order to reload the children of a `<CacheableSection>` wrapper and to send and receive the relevant messages for “recording mode” to and from the SW.

Communication between clients and service workers happens through the `postMessage` interface (reference: [client-to-service-worker](https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerGlobalScope/message_event), [service-worker-to-client](https://developer.mozilla.org/en-US/docs/Web/API/Client/postMessage)), an event-based system. Event-based logic doesn’t mix well with React’s declarative model, so we created an **Offline Interface** class that abstracts away the messaging events and exposes methods for easy communication with the service worker from the React environment. It uses an [`EventEmitter` object](https://nodejs.org/docs/latest/api/events.html#class-eventemitter) to translate received service worker messages into subscribable events internally. 

The `startRecording` method of the Offline Interface, which is used under the hood of the function with the same name returned by `useCacheableSection`, accepts several options and callback functions that can be used to coordinate the React state with the service worker state:

1. The ID of the section to record
2. A recording timeout delay, described in the “recording mode” [todo: link] section above
3. Callbacks:
   1. `onStarted`, which is called once the offline interface receives the message that service worker is ready to go
   2. `onCompleted`, which is called upon receiving the completion message
   3. `onError` which is called with an Error object as its argument when there’s an error with the recording

The `startRecording` method also returns a promise that resolves if it successfully sends the appropriate message to the service worker to initiate recording or rejects if that step fails, which is notably different from an error during recording.

The Offline Interface also provides methods for accessing metadata about and removing cached sections to consolidate usage of the CacheStorage and IndexedDB APIs in one place so the App Runtime components can call these methods without being aware of the implementation details. It also provides helper methods that handle SW updates and lifecycle management, as described in the “lifecycle management” section above [todo: link].

An Offline Interface object is instantiated [in the App Adapter](https://github.com/dhis2/app-platform/blob/2b17e60bea02dd9c4e6b441eeff36ffabea44996/adapter/src/index.js#L8) (recall its role from the app platform description above [Todo: link]) and passed to the consolidated App Runtime `Provider` that wraps the app, which then uses context to provide the Offline Interface object to the cacheable section components that use it — more on that in the next section.

###### React API: the `@dhis2/app-service-offline` package

The new `CacheableSection` component and the `useCacheableSection` hook are the necessary tools to implement cacheable sections in the app, and they are added to the new `@dhis2/app-service-offline` package in the App Runtime repository (and reexported from the `@dhis2/app-runtime` package, where though should be imported from). There is also a `useCachedSections` hook that returns metadata about which sections have been cached and when.

The `useCacheableSection(id)` hook provides both metadata about the cached section corresponding to that ID and the controls to `startRecording` or `remove` the cached section. It’s designed to be used by any component that needs access to info about cached sections, for example the chips in the dashboards bar in the Dashboard app. Each one uses the `useCacheableSection` hook to access whether or not that dashboard is cached; if it is, it displays an icon indicating that it’s available offline.

* The hook communicates with the service worker and manages recording state in the React environment, which must be shared between components so that the `CacheableSection` wrapper can handle reload its content according to the recording state. We faced a design challenge here because the state needs to be shared between components, but the `useCacheableSection` hook is expected to be consumed by many components like dashboard “chips” that will access sections’ cached status — if a naive React context approach is used, an update to a `recordingStates` object that’s shared by context would trigger rerenders in *every* component that’s consuming a `useCacheableSection` hook and every `CacheableSection` wrapper.

[to do: choose one of these two paragraphs ^ v ]

To coordinate the recording states between hooks and wrappers when they are separated in the component tree, they both access a “global recording state store” so they both use the same state. The hook is designed to be used by potentially many consumers however, and a naive implementation of the global recording state using React context would trigger rerenders for all components consuming the hook or wrapped by the wrapper, so we implemented a more performant state management solution to avoid unnecessary rerenders.

Austin McGee [todo: link] receives credit for the design of the Redux-like state management system, which uses a global store object and separate hooks for accessing and mutating data in the store. When using the hook to access data in the store, a ‘selector’ function must be provided as an argument to the hook that receives the store object and returns the value of interest to the hook’s consumer, for example `(store) => store.value`. The hook then subscribes to changes in the store with a function that compares the previous ‘selected’ value to the ‘new’ selected value. The state of the hook *only* updates if the selected value changes, which prevents a state update from triggering on *every* change to the store.

[link to proof-of-concept]

* A few levels of usage: recording state, 

[recording mode]

[todo: more]

The `CacheableSection` wrapper handles reloading its child components when a recording starts. It reads the recording state that’s controlled by the `useCacheableSection` hook of the corresponding section ID, and according to that recording state, decides to render the children and a loading mask accordingly. Here is a table that illustrates the recording states and the rendered results:

| Recording State                      | Children rendered?                                           | Loading Mask rendered? |
| ------------------------------------ | ------------------------------------------------------------ | ---------------------- |
| `default`                            | Yes                                                          | No                     |
| `pending` - awaiting recording start | No                                                           | No                     |
| `recording`                          | Yes - following `pending`, this causes children to reload and refetch data | Yes                    |
| `error`                              | Yes - in a way that causes the section to reload             | No                     |

The `CacheableSection` component receives the loading mask as a prop in JSX format and renders it during recording. The mask is expected to be a full-screen cover that blocks interaction with the app so that, while it’s rendered, the recording isn’t confounded by extraneous requests or navigation to different content. It’s rendered as a sibling to the children of the `CacheableSection`, so design the mask component accordingly. Here’s an example of a good loading mask using components from the `@dhis2/ui` library, and the API for passing it to the `CacheableSection`:

```jsx
import { Button, Layer, CenteredContent, CircularLoader } from '@dhis2/ui'

const LoadingMask = () => (
	<Layer translucent>
    	<CenteredContent>
            <CircularLoader />
        </CenteredContent>
    </Layer>
)

const CacheableComponent = ({ id }) => {
    const { startRecording } = useCacheableSection(id)
    
    return (
    	<div>
        	<Button onClick={startRecording}>Make available offline</Button>
            <CacheableSection id={id} loadingMask={<LoadingMask />}>
            	{/* Cacheable content goes here */}
            </CacheableSection>
        </div>
    )
}
```

The resulting source code for the CacheableSection component can be examined [here](https://github.com/dhis2/app-runtime/blob/e82e4e5d5913c68e0428f8c768a672b60efc5075/services/offline/src/lib/cacheable-section.tsx#L133-L169).





The components make extensive use of React context to access the Offline Interface object and to coordinate state… [maybe this goes later]

* Cached sections
* Cacheable section
  * Context
  * State - performance optimization
  * Blocking screen w/ loading mask prop
  * Recording mode
* useOnlineStatus



#### useOnlineStatus

* Todo



#### Clearing caches between users

- Todo



* Challenge: losing state when the service worker turns off

