---
id: overview-extensibility-features
title: Overview of available extensibility features
sidebar_label: Extensibility features overview
slug: /overview/all-features
---

This page provides an overview of the extensibility features available for building on top of and alongside DHIS2.

## Web API

The whole [Web REST API](https://docs.dhis2.org/en/develop/using-the-api/dhis-core-version-master/introduction.html) is available to use. Operations on data and metadata are generic and available to be used by any extension.

-   [Metadata API](https://docs.dhis2.org/en/develop/using-the-api/dhis-core-version-master/metadata.html): Provides a set of endpoints for managing all metadata entities, such as data elements, organisation units, indicators, and more. It uses standard CRUD operations via REST. Each metadata type has its own endpoint (e.g., `/api/dataElements`) supporting JSON and XML formats, and the bulk metadata endpoint supports both import and export with filtering, ordering, and transformation options.
-   [Data API](https://docs.dhis2.org/en/develop/using-the-api/dhis-core-version-master/data.html#webapi_data_values): Lets external systems send and retrieve aggregate data values, i.e the actual numeric or textual observations collected against data elements, organisation units and periods. It uses standard HTTP methods (GET, POST) over REST. Data can be exchanged in JSON, XML, or CSV formats.
-   [OpenAPI specification](https://docs.dhis2.org/en/develop/core-openapi-specification.html): A machine-readable description of the Web API that can be used to generate API clients in different languages and to explore the API interactively.
-   [Routes](https://docs.dhis2.org/en/develop/using-the-api/dhis-core-version-master/route.html) and the accompanying [Routes Manager App](https://docs.dhis2.org/en/use/user-guides/dhis-core-version-master/maintaining-the-system/route-manager.html): Routes are an API feature where the backend can securely perform credentialled requests to other services, so client-side extensions don't have to manage those credentials.
-   [Datastore](https://docs.dhis2.org/en/develop/using-the-api/dhis-core-version-master/data-store.html?h=) and the accompanying [Datastore Management App](https://docs.dhis2.org/en/use/user-guides/dhis-core-version-master/maintaining-the-system/datastore-management.html?h=datastore+master): Arbitrary data can be saved in JSON format on a DHIS2 instance using the datastore. There is a global datastore, where objects are subject to sharing settings, and a user datastore, where objects are available to the individual user. Objects are organized into namespaces.
-   [SQL views](https://docs.dhis2.org/en/develop/using-the-api/dhis-core-version-master/visualizations.html#webapi_sql_views): These provide the option of defining custom SQL queries to the database, that can then be executed via the web API to get the result. They can accept variables and parameters to be customized at runtime.
-   [Event hooks](https://docs.dhis2.org/en/develop/using-the-api/dhis-core-version-master/event-hooks.html?h=event+hooks+master): These can be set up to trigger events based on metadata changes or scheduler events. Upon triggering, they can trigger a webhook request, send a message to an Apache Artemis JMS or Apache Kafka instance, or log something to the console.

## Custom web apps

In addition to the core apps bundled with DHIS2, like the [Maintenance](https://docs.dhis2.org/en/use/user-guides/dhis-core-version-master/configuring-the-system/metadata.html#about_maintenance_app), [Dashboard](https://docs.dhis2.org/en/use/user-guides/dhis-core-version-master/analysing-data/dashboards.html#dashboard) and [Capture](https://docs.dhis2.org/en/use/user-guides/dhis-core-version-master/tracking-individual-level-data/capture.html#capture_app) apps, custom frontend apps can be developed and installed in an instance. It's easiest to create these apps with the [DHIS2 App Platform](/docs/app-platform/getting-started.md), mentioned below.

### Core libraries

-   [App Platform](/docs/app-platform/getting-started): The `@dhis2/cli-app-scripts` package sets up an app scaffold and handles the development and build tooling, including bundling and transpilation, manifest generation, app shell encapsulation, i18n extract and generate, tests infrastructure, and publication. It is the recommended starting point for any new DHIS2 web app.
-   [App Runtime](/docs/app-runtime/getting-started.md): The `@dhis2/app-runtime` package provides React hooks and components for the things every app does at runtime: data queries and mutations, alerts, configuration, server discovery, online/offline status, and authentication.
-   [UI Library](/docs/ui/webcomponents): The `@dhis2/ui` package is a library of reusable, accessible React components that follow the DHIS2 design system, so apps look and behave consistently with the rest of the platform.

### CLI tooling

-   [DHIS2 CLI](/docs/cli): The `d2` command-line tool. The `d2 app` subcommand wraps the App Platform scripts, and there are additional subcommands for cluster management and style configuration.
-   [d2 style](/docs/cli/style/getting-started): Shared Prettier and ESLint configuration for DHIS2 projects, so all apps use a consistent code style.

### Helper libraries

-   [Multi-calendar dates](https://github.com/dhis2/multi-calendar-dates): The `@dhis2/multi-calendar-dates` package handles DHIS2 Periods across every calendar DHIS2 supports, which makes apps work for implementations that don't use the Gregorian calendar. The UI library exposes [`Calendar`](/docs/ui/components/calendar) and [`CalendarInput`](/docs/ui/components/calendar-input) components that build on top of this library.
-   [Translation support (d2-i18n)](/docs/guides/translation-support.md): The internationalization helper used by the App Platform's i18n pipeline. Most apps interact with it via `i18n.t(...)` after running the platform's extract/generate scripts. If you're using the DHIS2 App Platform, much of the setup is handled automatically.
-   [Analytics](https://github.com/dhis2/analytics): The `@dhis2/analytics` package provides helper functions and shared React components used by the analytics apps (Data Visualizer, Line Listing, Pivot Tables) for building visualizations on top of the analytics API.

## Plugins

Plugins let you embed custom UI inside one of the core DHIS2 apps. They are themselves App Platform apps, but they expose a plugin entry point rather than a full standalone UI, so the host app can render your component at a specific extension point without having to fork the host app.

The plugins leverage the [App Runtime `<Plugin>` component](/docs/app-runtime/components/Plugin). This is useful if you want to understand how plugins communicate with their host app, or if you want to embed a plugin inside another app you're building yourself.

### Plugin types

-   [Dashboard plugins](/docs/dashboard-plugins/developer/getting-started): Add a custom item type to dashboards. Once installed, users can drop your plugin onto a dashboard and configure it like any other dashboard item. Supported from DHIS2 v40.5 onwards, with plugin support introduced in version 101.0.0 of the Dashboard app.
-   [Capture plugins](/docs/capture-plugins/developer/getting-started): Embed custom UI inside the Capture app. Three plugin extension points are currently supported: [Form Field Plugins](/docs/capture-plugins/developer/form-field-plugins/introduction), which replace a single data element field with a custom input, [Enrollment Plugins](/docs/capture-plugins/developer/enrollment-plugins/introduction), which inject custom UI into the enrollment flow, and [Bulk Data Entry Plugins](/docs/capture-plugins/developer/bulk-data-entry-plugin/introduction.mdx), which enable bulk operations in Capture (e.g., updating data across multiple tracked entities).

### Reference implementations

-   [Reference Form Field Plugin](https://github.com/dhis2/reference-form-field-plugin): An example of a form field plugin, useful as a starting point when building your own.

## Global Shell features

The [Global Shell](/docs/references/global-shell) is a shared wrapper that loads all DHIS2 apps inside it, introduced in v42. It provides the redesigned header bar, the [Command Palette](https://docs.dhis2.org/en/use/user-guides/dhis-core-version-master/navigating-the-dhis2-system/new-app-menu-command-palette.html#command_palette) for navigation (`Cmd/Ctrl+K`), and shared infrastructure for routing and PWA updates. Most apps work in the Global Shell unchanged, but it also opens up new extension points for apps that opt in.

### Extension points

-   [Shortcuts](/docs/app-platform/config/adding-shortcuts): Apps can declare shortcuts in `d2.config.js` that appear in the [Command Palette](https://docs.dhis2.org/en/use/user-guides/dhis-core-version-master/navigating-the-dhis2-system/new-app-menu-command-palette.html#command_palette) and link directly into specific pages in the app, so users can jump straight to those pages from anywhere in DHIS2. Requires `@dhis2/cli-app-scripts` v12.4.0 or later.

## Android

For mobile use cases there are several options, depending on how much of the off-the-shelf DHIS2 Android experience you want to keep.

### Apps

-   [DHIS2 Android Capture app](https://github.com/dhis2/dhis2-android-capture-app): The official Android Capture app is open source. Implementations sometimes fork it to add organisation-specific behavior. This is the heaviest option but starts from a complete, working app.

### Libraries

-   [Android SDK](/docs/mobile/android-sdk/overview): A library that abstracts the complexity of interacting with the DHIS2 Web API on Android. It handles metadata and data synchronization, the local offline-first database, and the same program rule and indicator engines that the server uses, so apps work offline.
-   [Mobile UI library](/docs/mobile/mobile-ui/overview): A design system based on [Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/), so the same UI code can target Android and desktop with minimal changes while staying visually consistent with DHIS2.
-   [Program rule engine](/docs/mobile/android-sdk/program-rule-engine): A standalone library that evaluates DHIS2 program rules. It is shared between the backend and the Android SDK, which means both server-side jobs and Android apps apply the same rule logic.

## Integrations

Applications can integrate with DHIS2 either through its [RESTful Web API](https://docs.dhis2.org/en/develop/using-the-api/dhis-core-version-master/introduction.html) or PostgreSQL database. The Web API is strongly recommended as it provides a stable, documented interface with better tooling support. See the [Integration Overview](/docs/integration/overview) for detailed guidance on integration approaches and technologies.

### Documentation and Guides

-   [Integration Overview](/docs/integration/overview): Provides an overview covering API vs database integration, the recommended integration stack (Java, Spring Boot, Apache Camel) and key components for building DHIS2 integrations.
-   The [DHIS2 integration & interoperability web page](https://dhis2.org/integration/) highlights the different technologies that can help you integrate DHIS2 into your architecture. The page also provides non-technical practical advice when formulating your integration & interoperability strategy together with links to integration code examples.
-   [Apache Camel](/docs/integration/apache-camel): Introduction to Apache Camel as middleware for DHIS2 integrations. The documentation includes the fundamentals of routes, endpoints, processors and getting started with the Maven Camel DHIS2 Archetype.
-   [Camel DHIS2 Component](/docs/integration/camel-dhis2-component): Documentation for the official Camel component that leverages the DHIS2 Java SDK, covering endpoint configuration, HTTP query parameters and CRUD operations.
-   [DHIS2 Java SDK](/docs/integration/dhis2-java-sdk): Lightweight Java library providing a fluent API and type-safe models for DHIS2 Web API interactions, including client creation, fetching resources, and error handling.
-   [FHIR Integration Strategy](https://dhis2.org/integration/fhir/): Overview of DHIS2's approach to HL7 FHIR interoperability, including how to map DHIS2 data models to FHIR profiles using transformation layers.
-   [Standing up a FHIR Gateway](/blog/2024/05/standing-up-a-fhir-gateway-for-dhis2-from-an-ig/): Blog post containing a step-by-step guide to creating an Implementation Guide-driven FHIR facade for DHIS2 using Apache Camel.

### Reference Implementations

-   [Reference DHIS2-MOSIP Integration](https://github.com/dhis2/reference-dhis2-mosip-integration): Demonstrates integration between DHIS2 and [MOSIP](https://www.mosip.io/) for linking national digital ID systems with health data.
-   [Reference Civil Registry Lookup](https://github.com/dhis2/reference-civil-registry-lookup): Capture App form field plugin that queries external civil registration systems to auto-fill demographic data and prevent duplicate records.
-   [Reference Organisation Unit Synchronisation](https://github.com/dhis2/reference-org-unit-sync): Event-driven implementation using change data capture (PostgreSQL logical replication and Debezium) to sync organization units across multiple DHIS2 instances.
-   [FHIR IG Generator App](https://github.com/dhis2/fhir-ig-generator-app): DHIS2 web app that generates [FHIR Implementation Guides](https://build.fhir.org/ig/FHIR/ig-guidance/index.html) from Tracker metadata, creating FHIR Logical Models, Questionnaires and ValueSets as documentation for FHIR-based integrations. The app is meant to help kickstart the FHIR Implementation Guide authoring process for DHIS2 metadata.

### Tools and Examples

-   [Integration Examples Repository](https://github.com/dhis2/integration-examples): Collection of small, focused examples covering scenarios like exporting DHIS2 data as FHIR resources and syncing between DHIS2 instances.
-   [Camel Archetype DHIS2](https://github.com/dhis2/camel-archetype-dhis2): Maven archetype for quickly creating Apache Camel 4 applications with Spring Boot that use the DHIS2 component.
