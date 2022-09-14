import React from "react";
import { Switch, Route } from "react-router-dom";
import { NotFound } from "@strapi/helper-plugin";
import pluginId from "../../pluginId";
import SettingsPage from "../SettingsPage";

const SettingsApp = () => {
  return (
    <div>
      <Switch>
        <Route path={`/settings/${pluginId}`} component={SettingsPage} exact />
        <Route component={NotFound} />
      </Switch>
    </div>
  );
};

export default SettingsApp;