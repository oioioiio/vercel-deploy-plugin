"use strict";


module.exports = {
  default: {},
  validator(config) {
    if (config.websites && !Array.isArray(config.websites)) {
      throw new Error("Config property `websites` has to be a array of objects [{ deployHook:string,appFilter:string }]");
    }
    if (config.apiToken && typeof config.apiToken !== "string") {
      throw new Error("Config property `apiToken` has to be a string");
    }
    if (config.teamFilter && typeof config.teamFilter !== "string") {
      throw new Error("Config property `teamFilter` has to be a string");
    }
    if (config.roles && !Array.isArray(config.roles)) {
      throw new Error("Config property `roles` has to be an array of strings");
    }
  },
};