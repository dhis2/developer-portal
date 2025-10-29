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
-   Integration
    -   Reference implementations
        - [Reference DHIS2-MOSIP Integration](https://github.com/dhis2/reference-dhis2-mosip-integration)
        - [Reference Civil Registry Lookup](https://github.com/dhis2/reference-civil-registry-lookup)
        - [Reference Organisation Unit Synchronisation](https://github.com/dhis2/reference-org-unit-sync)
    -   [FHIR IG Generator](https://github.com/dhis2/fhir-ig-generator-app)
    -   Apache Camel DHIS2 components
        -   [Apache Camel DHIS2 documentation](https://camel.apache.org/components/4.14.x/dhis2-component.html)
        -   [Camel DHIS2 Source Code](https://github.com/dhis2/camel-dhis2)
        -   [Camel Archetype DHIS2](https://github.com/dhis2/camel-archetype-dhis2)
    -   [Integration Examples](https://github.com/dhis2/integration-examples)
        -   [dhis2 fhir gateway](https://developers.dhis2.org/blog/2024/05/standing-up-a-fhir-gateway-for-dhis2-from-an-ig/)
    -   [FHIR Integration Strategy](https://dhis2.org/integration/fhir/)
