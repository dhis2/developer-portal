---
slug: what-is-this-app-platform
title: What is this DHIS2 Application Platform?
author: Austin McGee
author_url: https://github.com/amcgee
author_image_url: https://avatars.githubusercontent.com/u/947888?s=400&u=2051953d3237171aee830b7b3ee266a10995dcb2&v=4
tags: [app platform, developer tools, build system, architecture]
---

During the DHIS2 Annual Conference a few weeks ago I had the pleasure of introducing our ongoing efforts to develop a formalized and consolidation Application Platform here at UiO.

Keep in mind that **the Application Platform is still a work in progress!** It's not quite ready for prime-time yet, but if you're excited about where we're going (or have questions or concerns), don't hesitate to [reach out](mailto:austin@dhis2.org).

<!--truncate-->

# Watch the Annual Conference presentation

If you want to dive right in, here's a video reconstruction of my conference presentation:

<iframe src="https://player.vimeo.com/video/344797153" width="640" height="360" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>

You can also access the slides [here](https://docs.google.com/presentation/d/1tzYfmuurCfRNWtJjdOeQXJ2uiPTZsxE4WpV0_0XTw9E)

---

# Application Platform - The Architecture

## What is it?

The DHIS2 Application Platform reframes the concept of a DHIS2 app.

Today, a DHIS2 app is a standalone websites (often made with Create React App) and needs to compose a myriad of common tools and components (HeaderBar, data fetching logic, Org Unit Tree component, build scripts, manifest generation, translation, etc...)

With the upcoming Application Platform, all of the common things are provided out-of-the-box (via what we call an App Shell). All a developer needs to care about is how to implement the business logic that makes her or his application special.

## How does it work?

If you're familiar with [Create React App (CRA)](https://github.com/facebook/create-react-app), you can think of the DHIS2 Application Platform as a **Create DHIS2 App** tool. It gives you a zero-configuration, fully-featured DHIS2 app and lets you customize it from there. As a developer there's no need to worry about all the moving parts that will turn your business logic code into a shiny, modern DHIS2 app.

Each DHIS2 app will require just two dependencies - one for build tools and one for runtime helpers. The build tools will automatically download and serve the latest App Shell. It then "hosts" the simplified application within the shell. This paradigm is called **inversion of control** and is described in greater detail in the video.

## When can I use it?

For third-party apps : **not quite yet!** This is a big undertaking and we want to get it right. We're working hard to make sure everything is robust and well-designed before releasing it into the wild. We hope to leverage the application platform for several core DHIS2 applications in the 2.33 release timeframe (Q4 2019), after which time we'll formalize and document the finalized product.

## Where can I find it?

If you're trigger-happy you can find the code [here](https://github.com/dhis2/app-platform) and [here](https://github.com/dhis2/app-runtime). **Remember that it's not ready for production use yet** - things will probably be broken or we will break them before release, but feedback and contributions are welcome.
