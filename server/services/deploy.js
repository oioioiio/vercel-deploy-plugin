"use strict";

const axios = require("axios").default;
const { buildConfig, getFeatureAvailability } = require("./utils");


module.exports = ({ strapi }) => ({

  async runDeploy(website) {
    try {
      const config = buildConfig(strapi);
      const currentWebsite = config.websites.find(site => site.appFilter === website )
      if (!config || !currentWebsite.deployHook) {
        throw "missing configuration: deployHook";
      }

      const response = await axios.post(currentWebsite.deployHook);
      const deployJobId = response?.data?.job?.id;
      if (!deployJobId) {
        throw new Error(
          `Deployment Id not received. Response: ${JSON.stringify(response)}`
        );
      }

      return {
        data: {
          deployJobId,
        },
      };
    } catch (error) {
      console.error("[vercel-deploy] Error while deploying -", error);
      return {
        error: "An error occurred",
      };
    }
  },


  async getDeployments(website) {
    try {
      const config = buildConfig(strapi);
      const currentWebsite =  config.websites && config.websites.find(site => site.appFilter === website )

      if (!config || !config.apiToken || !currentWebsite) {
        throw "missing configuration: deployHook";
      }

      const params = {};

      if (currentWebsite.appFilter) {
        params.app = currentWebsite.appFilter;
      }

      if (config.teamFilter) {
        params.teamId = config.teamFilter;
      }

      const response = await axios.get(
        "https://api.vercel.com/v6/deployments",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${config.apiToken}`,
          },
          params,
        }
      );
      return response.data;
    } catch (error) {
      console.error(
        "[vercel-deploy] Error while fetching deployments -",
        error
      );
      return {
        error: "An error occurred",
      };
    }
  },

  
  deployAvailability(website) {
    try {
      const config = buildConfig(strapi);
      const currentWebsite = config.websites && config.websites.find(site => site.appFilter === website )

      const runDeployAvailability = getFeatureAvailability(
        currentWebsite,
        "deployHook"
      );
      const listDeployAvailability = getFeatureAvailability(config, "apiToken");
      const filterDeployAvailabilityPerName = getFeatureAvailability(
        currentWebsite,
        "appFilter"
      );
      const filterDeployAvailabilityPerTeam = getFeatureAvailability(
        config,
        "teamFilter"
      );

      return {
        data: {
          runDeploy: runDeployAvailability,
          listDeploy: listDeployAvailability,
          filterDeployPerAppName: filterDeployAvailabilityPerName,
          filterDeployPerTeamId: filterDeployAvailabilityPerTeam,
        },
      };
    } catch (error) {
      console.error(
        "[vercel-deploy] Error while building deploy availability -",
        error
      );
      return {
        error: "An error occurred",
      };
    }
  },
});