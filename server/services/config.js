"use strict";

const { buildConfig } = require("./utils");

module.exports = ({ strapi }) => ({

  getConfig() {
    return {
      data: buildConfig(strapi, true),
    };
  },
});