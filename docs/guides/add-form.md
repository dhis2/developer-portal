---
id: add-form
title: How to add a form
---

This guide will show you how to add a form to your app. 

## Prerequisites

This guide assumes that you're developing an application using the [DHIS2 Application Platform](https://platform.dhis2.nu/#/) and its tools. To know more or get started, please follow this tutorial: [Environment Setup](/docs/tutorials/setup-env).  

This guide also assumes some familiarity with the [UI library documentation](https://ui.dhis2.nu/demo/?path=/docs/about-this-documentation-for-readers--page), which contains examples, demos, and a sandbox of form elements to help you get started.

Finally, this guide assumes you've read through the [DHIS2 Design System](https://github.com/dhis2/design-system), which is a collection of design guidelines and patterns for DHIS2.


## 1. Add the UI library as a dependency

First, add the UI library as a dependency to your project:

```shell
yarn add @dhis2/ui
```

## 2. Add a button to submit the form

The button will be used to submit your form. See [`Button` in the UI library](https://ui.dhis2.nu/demo/?path=/docs/actions-buttons-button--basic) for full examples and documentation. 

Here's an example of adding a simple button:

```js
import { Button } from '@dhis2/ui'

<Button name="Basic button" onClick={logger} value="default">
    Label me!
</Button>
```

## 3. Add the form components

Now, it's time to add the form components you need. Components may have different levels of composition. For example, [`input`](https://ui.dhis2.nu/demo/?path=/docs/forms-input-input--default) is the core component and [`input field`](https://ui.dhis2.nu/demo/?path=/docs/forms-input-input-field--default) builds on that by adding a label, help text, and validation text.

To add an input field as an example:

```js
<InputField label="Default label" name="defaultName" onChange={logger} />
```