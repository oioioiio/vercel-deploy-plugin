# Vercel Deploy

Strapi v4 plugin to trigger and monitor a deployment on Vercel for multi sites.
This plugin is taken from the strapi-plugin-vercel-deploy page and modified as needed to work with multiple pages

## Installation

### Install dependency

Run the following command in your Strapi project to install vercel-deploy:

```
yarn add vercel-deploy
# or
npm i -S vercel-deploy
```
### Enable plugin configuration

Open config/plugins.js file and add the vercel-deploy entry:

```
module.exports = ({ env }) => ({
  "vercel-deploy": {
    enabled: true,
  },
});
```

### Run 

You can now run Strapi:

```
yarn develop
```

You should see the **Vercel Deploy** menu in the left panel.

**N.B**. You may need to run ```yarn build``` in order to see the new menu entries.

Then you can proceed with the plugin configuration.

## Plugin Configuration

### Config properties

Example:

```
module.exports = ({ env }) => ({
  "vercel-deploy": {
    enabled: true,
    config: {
      websites:[
          {
            deployHook: "https://api.vercel.com/v1/integrations/deploy/prj_<deploy-hook>",
            appFilter: "your-app-name-on-vercel",
            label:"your website name"
          },
          {
            deployHook: "https://api.vercel.com/v1/integrations/deploy/prj_<deploy-hook>",
            appFilter: "your-secound-app-name-on-vercel",
            label:"your secound website name"
          }
      ]
      apiToken: "<vercel-api-token>",
      teamFilter: "your-team-id-on-vercel",
      roles: ["strapi-super-admin", "strapi-editor", "strapi-author"],
    },
  },
});
```

### Webpack.EnvironmentPlugin Configuration

```
```

- Rename ./src/admin/webpack.config.example.js to ./src/admin/webpack.config.js.
- Add the webpack.EnvironmentPlugin, which reads from the current process.env and assigns then to frontend, my full file is below.

```
"use strict";

/* eslint-disable no-unused-vars */
module.exports = (config, webpack) => {
  // Note: we provide webpack above so you should not `require` it
  // Perform customizations to webpack config

  config.plugins.push(
    new webpack.DefinePlugin({
      VERCEL_DEPLOY_PLUGIN_APP_FILTER:JSON.stringify(process.env.VERCEL_DEPLOY_PLUGIN_APP_FILTER)
    })
  );

  // Important: return the modified config
  return config;
};
```

### Environment Configuration

You shouldn't disclose the api token and the deploy hook url for security reasons. Therefore, you shouldn't add these values to versioning in a public git repository. A suggested solution is to use environment variables. Example:

```
module.exports = ({ env }) => ({
  "vercel-deploy": {
    enabled: true,
    config: {
      websites:[
       {
          deployHook: "process.env.VERCEL_DEPLOY_PLUGIN_HOOK",  
          appFilter: "VERCEL_DEPLOY_PLUGIN_APP_FILTER", /// same as webpack config (default)
          label:"your website name"
        },
        {
          deployHook: "process.env.VERCEL_DEPLOY_PLUGIN_HOOK_PL",
          appFilter: "VERCEL_DEPLOY_PLUGIN_APP_FILTER_PL",
          label:"your secound website name"
        }
      ]
      apiToken: process.env.VERCEL_DEPLOY_PLUGIN_API_TOKEN,
      teamFilter: process.env.VERCEL_DEPLOY_PLUGIN_TEAM_FILTER,
      roles: ["strapi-super-admin"],
    },
  },
});
```

### Local development

For local development, you can add the config properties in your .env file:

```
VERCEL_DEPLOY_PLUGIN_HOOK="https://api.vercel.com/v1/integrations/deploy/prj_<deploy-hook>"
VERCEL_DEPLOY_PLUGIN_API_TOKEN="<vercel-api-token>"
VERCEL_DEPLOY_PLUGIN_APP_FILTER="your-app-name-on-vercel"
VERCEL_DEPLOY_PLUGIN_TEAM_FILTER="your-team-id-on-vercel"
```
