---
id: overview-extensibility-features
title: Overview of available extensibility features
sidebar_label: Extensibility features overview
slug: /overview/all-features
---

This page provides an overview of all of the extensibility features that are available that can help you develop what you need to on top of and alongside DHIS2.

-   API: The whole [Web REST API](https://docs.dhis2.org/en/develop/using-the-api/dhis-core-version-master/introduction.html) is available to use. Operations on data and metadata are generic and available to be used by any extension.
    -   [Routes](https://docs.dhis2.org/en/develop/using-the-api/dhis-core-version-master/visualizations.html#webapi_sql_views) (+ App): Routes are an API feature where the backend can securely perform credentialled requests to other services, so client-side extensions don't have to manage those credentials.
    -   [Datastore](https://docs.dhis2.org/en/develop/using-the-api/dhis-core-version-master/data-store.html?h=) (+ App): Arbitrary data can be saved in JSON format on a DHIS2 instance using the datastore. There is a global datastore, where objects are subject to sharing settings, and a user datastore, where objects are available to the individual user. Objects are organized into namespaces, and they are subject to sharing settings.
    -   [SQL views](https://docs.dhis2.org/en/develop/using-the-api/dhis-core-version-master/visualizations.html#webapi_sql_views): These provide the option of defining custom SQL queries to the database, that can then be executed via the web API to get the result. They can accept variables and parameters to be customized at runtime.
    -   [Event hooks](https://docs.dhis2.org/en/develop/using-the-api/dhis-core-version-master/visualizations.html#webapi_sql_views): These can be set up to trigger events based on metadata changes or scheduler events. Upon triggering, they can trigger a webhook request, send a message to an Apache Artemis JMS or Apache Kafka instance, or log something to the console.
    -   (Metadata & Data APIs)
-   Custom Apps: In addition to the core apps that are bundled with DHIS2, like the Maintenance, Dashboard, and Capture apps, custom frontend apps can be developed and installed in an instance. It's easiest to create these apps with the DHIS2 App Platform, mentioned below.
-   Libraries: To develop custom apps, DHIS2 provides a number of libraries to make development easier, higher quality, and more secure.
    -   App platform: The App Platform library does a number of things for DHIS2 apps: sets up an app scaffold, manages shared UI components, handles internationalization
    -   App runtime: 
    -   UI library
    -   CLI
    -   Multi-calendar dates: It's common to need to handle Periods in DHIS2, and this library provides ways of handling those across all possible calendars, making apps more internationalizable. There are also Calendar and Calendar Input components available in the UI library.
    -   d2-18n
    -   Analytics
    -   Others (d2-style)
-   Plugins
    -   Dashboard
    -   Capture (x3)
        -   [Reference Form Field Plugin](https://github.com/dhis2/reference-form-field-plugin)
-   Java SDK
-   Android apps
    -   (Forked capture)
    -   Fully custom apps
    -   Custom intents
-   Android libraries
    -   Android SDK
    -   Mobile UI library
-   Program rule engine
-   Global shell
-   Shortcuts

## Integrations

Applications can integrate with DHIS2 either through its [RESTful Web API](https://docs.dhis2.org/en/develop/using-the-api/dhis-core-version-master/introduction.html) or PostgreSQL database. The Web API is strongly recommended as it provides a stable, documented interface with better tooling support. See the [Integration Overview](/docs/integration/overview) for detailed guidance on integration approaches and technologies.

### Documentation and Guides
- [Integration Overview](/docs/integration/overview): Provides an overview covering API vs database integration, the recommended integration stack (Java, Spring Boot, Apache Camel) and key components for building DHIS2 integrations.
- The [DHIS2 integration & interoperability web page](https://dhis2.org/integration/) highlights the different technoloies that can help you integrate DHIS2 into your architecture. The page also provides non-technical practical advice when formulating your integration & interoperability strategy together with links to integration code examples. 
- [Apache Camel](/docs/integration/apache-camel): Introduction to Apache Camel as middleware for DHIS2 integrations. The documentation includes the fundamentals of routes, endpoints, processors and getting started with the Maven Camel DHIS2 Archetype.
- [Camel DHIS2 Component](/docs/integration/camel-dhis2-component): Documentation for the official Camel component that leverages the DHIS2 Java SDK, covering endpoint configuration, HTTP query parameters and CRUD operations.
- [DHIS2 Java SDK](/docs/integration/dhis2-java-sdk): Lightweight Java library providing a fluent API and type-safe models for DHIS2 Web API interactions, including client creation, fetching resources, and error handling.
- [FHIR Integration Strategy](https://dhis2.org/integration/fhir/): Overview of DHIS2's approach to HL7 FHIR interoperability, including how to map DHIS2 data models to FHIR profiles using transformation layers.
- [Standing up a FHIR Gateway](/blog/2024/05/standing-up-a-fhir-gateway-for-dhis2-from-an-ig/): Blog post containing a Step-by-step guide to creating an Implementation Guide-driven FHIR facade for DHIS2 using Apache Camel.

### Reference Implementations
- [Reference DHIS2-MOSIP Integration](https://github.com/dhis2/reference-dhis2-mosip-integration): Demonstrates integration between DHIS2 and [MOSIP](https://www.mosip.io/) for linking national digital ID systems with health data.
- [Reference Civil Registry Lookup](https://github.com/dhis2/reference-civil-registry-lookup): Capture App form field plugin that queries external civil registration systems to auto-fill demographic data and prevent duplicate records.
- [Reference Organisation Unit Synchronisation](https://github.com/dhis2/reference-org-unit-sync): Event-driven implementation using change data capture (PostgreSQL logical replication and Debezium) to sync organization units across multiple DHIS2 instances.
- [FHIR IG Generator App](https://github.com/dhis2/fhir-ig-generator-app): DHIS2 web app that generates [FHIR Implementation Guides](https://build.fhir.org/ig/FHIR/ig-guidance/index.html) from Tracker metadata, creating FHIR Logical Models, Questionnaires and ValueSets as documentation for FHIR-based integrations. The app is meant to help kickstart the FHIR Implementation Guide authoring process for DHIS2 metadata

### Tools and Examples
- [Integration Examples Repository](https://github.com/dhis2/integration-examples): Collection of small, focused examples covering scenarios like exporting DHIS2 data as FHIR resources and syncing between DHIS2 instances.
- [Camel Archetype DHIS2](https://github.com/dhis2/camel-archetype-dhis2): Maven archetype for quickly creating Apache Camel 4 applications with Spring Boot that use the DHIS2 component.
