"use strict";

const getPluginConfig = require("../helpers/pluginConfig");

const buildConfig = (strapi, hideSensitiveInfo = false) => {
  const pluginConfig = getPluginConfig(strapi);

  const apiToken = pluginConfig("apiToken");

  return {
    websites: pluginConfig("websites"),
    apiToken: hideSensitiveInfo ? apiToken?.substring(0, 6) : apiToken,
    teamFilter: pluginConfig("teamFilter"),
  };
};

const getFeatureAvailability = (configObj, configName) => {
  if (!configObj) {
    return "MISSING_CONFIG_OBJECT";
  }

  if (!configObj[configName]) {
    return "MISSING_CONFIG_VARIABLE";
  }

  return "AVAILABLE";
};

module.exports = {
  buildConfig,
  getFeatureAvailability,
};