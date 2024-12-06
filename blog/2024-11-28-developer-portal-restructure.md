---
slug: 2024/11/developer-portal-restructure
title: Developer Portal has a new Navigation Structure
authors: rene
tags: [developer-portal]
date: 2024-11-28
---

In recent months, more and more documentation has been added to the Developer Portal. But with many new additions, the navigation structure of the Developer Portal has become a bit cluttered. To make it easier to find the information you need, we've restructured the navigation of the Developer Portal.

In this blogpost we'll quickly go over all the new releases, and how the new structure is implemented to not only make it more organized, but also to be more future-proof for new sections that will be added in the future.

<!--truncate-->

The Developer Portal Docs section has always consisted of a split between Guides & Tutorials and References. But as new sections have been added to the Developer Portal, such as the UI Library and Mobile UI docs, the navigation has become a bit cluttered. Therefore we decided to restructure the navigation of the Developer Portal.

### UI Library

The UI library was previously hosted on a separate site, but we've now moved it to the Developer Portal. The UI Library is a collection of reusable components which can be used to build your own DHIS2 applications.  These components implement the [DHIS2 Design System](/design-system) which consists of best practices, predefined colors, an icon library and other patterns and principles. The Design System documentation is now separated from the Web UI components. The Design system is applicable to all DHIS2 applications (Web & Android), while the Web UI components are specifically for use in web applications.

You can find the [Design System](/design-system) in the top bar navigation of the Developer Portal, while the [Web UI components](/docs/ui/webcomponents) are found in the Reference Docs section.

We've also moved the interactive demo into the developer portal, but it still lives as a separate page. You can find the [Interactive Demo](pathname:///demo/) from within each Web UI component page through the in-line demos.

### Mobile Documentation

The Mobile Documentation has been introduced into the Developer portal only recently, and has shortly lived as a top-level navigation item. But as it *actually* had a place as a sub-section of the Guides & Tutorials section, we've moved it there. You can find the [Mobile Documentation in the Guides & Tutorials section](/docs/mobile). You can expect more content to be added to this section in the near future.

### Splitting of Guides & Tutorials from Reference Docs

Previously, all guides, tutorial and references were found in the same section, hidden under the "docs" label in the top-level navigation. However, as the Developer Portal has grown, we've decided to split these two parts into two separate top-level sections. Guides & Tutorials can be found in the [Guides & Tutorials section](/docs), while References can be found in the [Reference Docs section](/docs/references). This makes it easier to find the information you need, and also makes it easier to add new sections in the future.

## Searching within Developer Portal & AI

Because many new sections have been added to the Developer Portal, the search bar on the top-right has also become more useful. Not only is it able to search whatever was there before the merge, but now it knows about many more pages. This is incredibly useful as a one-stop search.

But if  that is not enough, several months ago we released a new AI Search Assistent. This AI is accessible through the "Ask AI" button in the bottom-right corner of the Developer Portal. This is powered by the amazing [Kapa AI](https://kapa.ai/) and is able to answer many of your questions. But as it knows much more than just what is in the Developer Portal, it can also answer questions about the DHIS2 Web API, the DHIS2 Community of Practice, and general usage of DHIS2. 

If you're using this, make sure to give us feedback by pressing the thumbs-up or thumbs-down button after you've received an answer. Then, when applicable, you can add a comment to your rating which we'll be able to see. This will help us improve the AI over time.

## Conclusion

We hope that with this new structure it will be easier to find the information you need. It should make the Developer Portal a more pleasant experience to use. If you have any feedback, please let us know on the [Community of Practice](https://community.dhis2.org/c/development/developer-portal/). We're always looking for ways to improve the Developer Portal, and your feedback is invaluable to us.