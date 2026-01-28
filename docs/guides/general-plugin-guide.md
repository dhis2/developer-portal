---
id: general-plugin-guide
title: General Plugin Guide
---
:::warning Experimental feature
The plugin framework is currently an experimental feature and is subject to change.
We are working on improving both the technology and the way you use it. We will provide more documentation and examples as we progress.
:::

:::info Supported versions
The plugin framework is supported in **DHIS2 version 40.5 and later**. Dashboard app support was introduced in Dashboard v101.0.0. 
:::

## Introduction
Plugins let you extend DHIS2 core apps with custom UI and logic that runs inside the host app.

A plugin is packaged as a DHIS2 app, but instead of rendering its own app shell it exports one or more React components. The host app (Capture, Dashboard, etc.) loads and mounts those components at specific extension points.

Across plugin types, the fundamentals are the same:

- They are React-based and built using the [DHIS2 App Platform tooling](/docs/app-platform/getting-started.md)
- They are loaded and rendered by a host application (Capture, Dashboard, etc.)
- They receive all context and data through props
- They do not manage routing, navigation, or global application state

The different plugin types include:

- [Form Field Plugins](/docs/capture-plugins/developer/form-field-plugins/introduction.md), which extend Capture data entry forms (for example by auto-generating values or validating input). A complete [reference implementation](https://github.com/dhis2/reference-form-field-plugin) is available on GitHub.
- [Enrollment Plugins](/docs/capture-plugins/developer/enrollment-plugins/introduction), which add custom views or dashboards on tracker enrollment pages. See the official [WHO Growth Chart Plugin](https://apps.dhis2.org/app/09f48f78-b67c-4efa-90ad-9ac2fed53bb8) on the App Hub for an example.
- [Dashboard Plugins](/docs/dashboard-plugins/developer/getting-started.md) embed custom visualizations or controls in the Dashboard app.

All plugins are built as [DHIS2 App Platform apps](/docs/app-platform/getting-started.md) with a `plugin` entry point configured in `d2.config.js`. They receive context through props from the host app (see [Consuming plugin props](#consuming-plugin-props) below).

For more information about how plugins are loaded at runtime, see the App Runtime [Plugin component](/docs/app-runtime/components/Plugin).

## What is a plugin?

At runtime, a plugin is just a React component. The host app decides:

- **When** the plugin is rendered
- **Where** it is rendered
- **Which props** are passed to it

The plugin itself is responsible only for rendering UI and reacting to prop changes. It should not make assumptions about routing, user navigation, or surrounding layout. 

Under the hood, the host app uses the `Plugin` component from `@dhis2/app-runtime` to dynamically load the plugin bundle and mount the exported component.

You do not manually instantiate plugins in code. Instead, you:

1. Build a plugin as a DHIS2 app
2. Install it into a DHIS2 instance like any other app
3. Configure the host app to use it (for example in the Tracker Plugin Configurator for Capture plugins, or as a dashboard item for Dashboard plugins)

## Common structure of a plugin app

All plugin types share the same basic app structure.

```
my-plugin/
├─ src/
│  ├─ Plugin.(js|tsx)   # The exported plugin component
│  ├─ App.(js|tsx)      # (Optional) local wrapper for development
│  └─ index.js
├─ public/
├─ d2.config.js
├─ package.json
```

Key points:

- `Plugin.*` exports the plugin component that the host app loads.
- `App.*` is optional, but convenient for local development (it can render your plugin with mocked props).
- The `plugin` entry point is configured in `d2.config.js`.

## Developing a Plugin

When developing a plugin, most of the tooling and patterns are the same as for a regular DHIS2 app. The key difference is that a plugin is *embedded* inside another app and communicates with it using props.

This section walks through scaffolding, configuration, a minimal example, and what to expect from props.

For a complete example with additional context and implementation details, see the [Reference Form Field Plugin](https://github.com/dhis2/reference-form-field-plugin).

### 1. Scaffold a Plugin App

Use the [DHIS2 CLI](/docs/cli) to bootstrap your plugin project:

```bash
yarn global add @dhis2/cli
d2 app scripts init my-plugin
cd my-plugin
```

Pick `app` as the app type. If you only need a plugin, you can remove the default `app` entry point later.

### 2. Configure Your Plugin

In your `d2.config.js`, define the plugin entry point and type:

```js
module.exports = {
  name: 'my-plugin',
  type: 'app',
  pluginType: 'CAPTURE', // or 'DASHBOARD'
  entryPoints: {
    plugin: './src/Plugin.tsx'
  }
}
```

You can also include an `app` entry if you want to preview your plugin locally.

:::info Plugin Types
Use `pluginType: 'CAPTURE'` for Capture plugins and `pluginType: 'DASHBOARD'` for Dashboard plugins.
:::

### 3. Implement the Plugin Component

The plugin component is a React function that receives props from the host app. The exact props differ between plugin types, but the pattern stays the same:

- read context from props
- render UI
- call host-provided setters/callbacks in response to user actions

In practice:

- **Props as input**: the plugin reads the current value from `values`.
- **Host callbacks as output**: the plugin requests a host state update by calling `setFieldValue`.
- **No global app concerns**: there is no routing or navigation; the plugin only renders UI.

The example below is intentionally small. It’s meant to show the input/output flow between host app state (props) and host app updates (callbacks).

:::info Minimal functional example
This example is intentionally minimal (but functional). It uses plain HTML elements and does not leverage the DHIS2 UI library.

For a more complete example (including DHIS2 UI components, i18n patterns, and additional safeguards), see the [Reference Form Field Plugin](https://github.com/dhis2/reference-form-field-plugin).
:::

Here is a minimal Capture example:


```jsx
// src/Plugin.jsx
import React from 'react'

const generateCustomId = () => {
  return `CUST-${Date.now()}`
}

export default function Plugin({ values, setFieldValue }) {
  const value = values?.id ?? ''

  const handleGenerate = () => {
    setFieldValue({ fieldId: 'id', value: generateCustomId() })
  }

  return (
    <div>
      <input
        value={value}
        readOnly
        placeholder="Generate ID"
      />
      <button type="button" onClick={handleGenerate}>
        Generate ID
      </button>
    </div>
  )
}
```

This plugin renders a field and a button that generates a custom ID. It reads the current value from `values` and updates it by calling `setFieldValue`.

![Minimal functional form field plugin example (Capture)](./assets/simple-form-field-plugin.gif)

*Example: clicking "Generate ID" updates the mapped Capture form field via `setFieldValue`.*

The `id` must match the plugin field alias configured in the [Tracker Plugin Configurator](/docs/capture-plugins/developer/configure-a-capture-plugin.mdx) (or manually in the `dataEntryForms` config). If the field isn't mapped, the plugin won't receive the value and updates will have no effect.

#### Field mapping example (Tracker Plugin Configurator)
If your plugin field mapping in the configurator looks like this: 
```json
{
  "IdFromApp": "BdvE9shT6GX",        // Tracked Entity Attribute ID
  "IdFromPlugin": "id",   // Alias used in your plugin
  "objectType": "TrackedEntityAttribute"
}
```

Then in your plugin code, you must reference that field like this:
```jsx
setFieldValue({ fieldId: 'id', value: 'ID-1234' })
```

This updates the corresponding tracked entity attribute in the form state, and the value will be included when the form is submitted.

This is a common pattern for form field plugins that add custom input widgets or integrate with external services.

### 4. Consuming Plugin Props

Plugins receive props from the host app to provide context and control interactions.

Think of props as the plugin’s contract:

- Props are the single source of truth for host-provided state.
- Your plugin should react to prop changes.
- Avoid duplicating host state in your own React state unless necessary.

#### Capture Plugin Props

Form Field and Enrollment plugins receive a consistent set of props, including:

- `values` – current form values
- `errors`, `warnings` – field-level errors and warnings
- `formSubmitted` – boolean for form submit state
- `fieldsMetadata` – field configuration and metadata
- `setFieldValue()` – update a field
- `setContextFieldValue()` – update context fields like `enrolledAt`

The Capture example above already shows the most important pattern: using `values` as input and `setFieldValue` as the output channel back to the host app.

In a real plugin, you could expand that example by using `fieldsMetadata` to render the configured form label/placeholder and by using `errors`/`warnings` and `formSubmitted` to show validation feedback.

Full details: [Capture Plugin Props](https://developers.dhis2.org/docs/capture-plugins/developer/form-field-plugins/developer-details#props)

#### Dashboard Plugin Props

Dashboard plugins receive props such as:

- `dashboardItemId` – unique ID of the widget
- `dashboardItemFilters` – filters applied to the widget
- `dashboardMode` – edit/view mode indicator
- `setDashboardItemDetails()` – set the widget title or description

This is the same overall pattern as in Capture, but with different props:

- **Props as input**: dashboard filters and mode come in via props.
- **Host callbacks as output**: you call `setDashboardItemDetails` to update widget metadata (like the title).

Example usage:

```tsx
import React, { useEffect } from 'react'

export default function Plugin({
  dashboardItemId,
  dashboardItemFilters,
  dashboardMode,
  setDashboardItemDetails
}) {
  useEffect(() => {
    setDashboardItemDetails({ itemTitle: 'My Plugin Title' })
  }, [])

  return (
    <div>
      <h3>Dashboard Mode: {dashboardMode}</h3>
      <pre>{JSON.stringify(dashboardItemFilters, null, 2)}</pre>
    </div>
  )
}
```

This example shows a Dashboard plugin that uses the widget context to set a title on mount and display the current filters and mode. It’s a quick way to verify that your plugin receives the expected dashboard props.

Full details: [Dashboard Plugin Props](/docs/dashboard-plugins/developer/implement-a-dashboard-plugin#using-the-props-from-the-dashboard)

## Development workflow (recommended)

A common workflow that applies to all plugin types:

1. Develop locally with `yarn start` (optionally using an `app` entry point as a wrapper).
2. Use mocked props in your wrapper so you can iterate quickly.
3. Build a ZIP with `yarn build`.
4. Install the ZIP into a DHIS2 instance and test in the host app (Capture/Dashboard).

:::tip
Plugins can only interact with fields they have been granted access to through configuration. Attempting to access other fields will result in errors.
:::

### 5. Local Development

To run the plugin locally and preview it in the browser:

```bash
yarn start
```

By default, the app will be available at `http://localhost:3000`.

### 6. Build and Deploy

Use the following command to build a production bundle:

```bash
yarn build
```

The resulting ZIP in `build/` can be uploaded via the App Management app or deployed through the App CLI. Plugins can also be published to the [DHIS2 App Hub](https://apps.dhis2.org/).

#### Deploying a Capture Plugin
Use the [Tracker Plugin Configurator](https://apps.dhis2.org/app/85d156b7-6e3f-43f0-be57-395449393f7d) to assign your plugin to a form and map field IDs.

#### Deploying a Dashboard Plugin
Once installed, your plugin will appear under "Apps" when adding items to a dashboard.

For more detailed plugin usage and patterns, see the [reference form field plugin](https://github.com/dhis2/reference-form-field-plugin) and [civil registry example](https://github.com/eirikhaugstulen/civil-registry-plugin).

## Where to go next

This guide covered the shared concepts behind all DHIS2 plugins. For more information, dive into the plugin-type-specific documentation:

- Capture plugins: [Getting started](/docs/capture-plugins/developer/getting-started/)
- Form field plugins: [Introduction](/docs/capture-plugins/developer/form-field-plugins/introduction.md)
- Enrollment plugins: [Introduction](/docs/capture-plugins/developer/enrollment-plugins/introduction)
- Dashboard plugins: [Getting started](/docs/dashboard-plugins/developer/getting-started.md)

Related reference:

- App Runtime: [Plugin component](/docs/app-runtime/components/Plugin)
