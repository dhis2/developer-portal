---
id: publish-apphub
title: How to setup continous delivery to the App Hub

---

Once you have [submitted](/docs/guides/submit-apphub) your app and it's been reviewed by the DHIS2 Core Team, your app is live on the App Hub and can be installed directly from other DHIS2 instances through the App Management App. However, it is annoying and time consuming to upload new app versions manually, and difficult to keep it in sync with your development process. This guide will walk you through how to setup continous delivery to the App Hub, so new versions are automatically built and pushed to the App Hub. 


> Note that this guide assumes that your app built using the [DHIS2 Application Platform](https://platform.dhis2.nu/#/). See the [tutorial](/docs/tutorials/setup-env) for how to build your first DHIS2 app.

> We will use [Github Actions](https://docs.github.com/en/actions) to power the continous integration process. It is recommended that you to familiar yourself with the Github Actions' documentation, but it's not necessary for completion of this tutorial. 


#### 1. Sign in to the [DHIS2 App Hub](https://apps.dhis2.org/)

Click the profile-icon on the top right and click "Your API Keys". 

#### 2. Generate your API key

Click "Generate API key". Write this key down, you will not be able to see it again.

#### 3. Setting the repository secret

Navigate to the Github repository of your app. Click "Settings" -> "Secrets". Click "New repostory secret". Use `D2_APP_HUB_API_KEY` as the name and paste the API-key in the previous step as the value. 


#### 4. Setting the AppId

When uploading a new version to the App Hub, it needs to know which app to upload to. This is done using the ID-field in the `d2.config.js`.

Navigate to the App Hub and find your app in the list. Click on the app, and copy the `id` from the browser URL. The ID should look like `b783bf32-0cc2-4d31-aadc-22d4c4807c30`.

Set the `id` field in the `d2.config.js` in your app to the id of the app on the App Hub.

The `minDHIS2Version` is compulsory as well, so set the minimum DHIS2 version that this app is compatible with.

```
// d2.config.js

 const config = {
    id: 'b783bf32-0cc2-4d31-aadc-22d4c4807c30',
    type: 'app',
    entryPoints: {
        app: './src/App.js',
    },
    minDHIS2Version: '2.34',
}
module.exports = config
```


#### 4. Adding Github Action Workflow








Using the publish script should be easy, and you can at any time manually run `yarn run d2-app-scripts publish`. Note that this will fail if the app version already exists on the App Hub, so be sure to run `yarn version` first.