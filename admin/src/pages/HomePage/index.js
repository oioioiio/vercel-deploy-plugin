/*
 *
 * HomePage
 *
 */

import React, { memo, useState } from "react";

import { Box } from "@strapi/design-system/Box";
import { BaseHeaderLayout } from "@strapi/design-system/Layout";
import { LoadingIndicatorPage } from "@strapi/helper-plugin";
import { Link } from "@strapi/design-system/Link";
import ArrowLeft from "@strapi/icons/ArrowLeft";
import { getConfig } from "../../utils/api";
import Notifications from "../../components/Notifications";
import SymmetricBox from "../../components/SymmetricBox";
import DeployButton from "../../components/DeployButton";
import DeploymentsContainer from "../../components/DeploymentsContainer";
import DeploymentsEmptyState from "../../components/DeploymentsEmptyState";
import { useDeployAvailability } from "../../hooks/useDeployAvailability";
import { useFormattedMessage } from "../../hooks/useFormattedMessage";
import { useEffect } from 'react'


const getDeploymentsEmptyStateType = (
  availabilityApiError,
  listDeployAvailability
) => {
  if (availabilityApiError) {
    switch (availabilityApiError) {
      case "FORBIDDEN":
        return "ERROR_AVAILABILITY_FORBIDDEN";

      case "GENERIC_ERROR":
      default:
        return "ERROR_AVAILABILITY_GENERIC";
    }
  }

  return listDeployAvailability;
};


const HomePage = () => {
  const headerTitle = useFormattedMessage("home-page.header.title");
  const headerSubtitle = useFormattedMessage("home-page.header.subtitle");
  const [website, setWebsite] = useState(VERCEL_DEPLOY_PLUGIN_APP_FILTER)
  const initialConfig = {};
  const [pluginConfig, setPluginConfig] = useState(initialConfig);


  useEffect(() => {
    getConfig()
      .then((response) => {
        setPluginConfig(response.data);
      })
      .catch((error) => {
        console.error(
          "[vercel-deploy] error while retrieving plugin config",
          error
        );
        setPluginConfig({});
      })
  }, [setPluginConfig]);

  const [isLoadingAvailability, availability, apiError] =
    useDeployAvailability(website);

  const [useDeploymentsPolling, setUseDeploymentsPolling] = useState(false);

  const onDeploymentsFetched = (hasNonFinalState) => {

    setUseDeploymentsPolling(hasNonFinalState);
  };

  if (isLoadingAvailability) {
    return <LoadingIndicatorPage />;
  }

  const canListDeploy = availability?.listDeploy == "AVAILABLE";

  const onDeployed = (hasError) => {
    if (hasError) return;
    setUseDeploymentsPolling(true);
  };


  return (
    <Notifications>
      <div style={{padding:"20px"}}>
        <label for="websites" style={{marginRight:"10px"}}>Choose Website:</label>
        <select name="websites" id="websites" onChange={(e) => {
          setWebsite(e.target.value)
        }}>
           {pluginConfig.websites && pluginConfig.websites.map((site,i) => (
              <option key={i} value={site.appFilter}>{site.label}</option>
            ))}
        </select>
      </div>
      <Box background="neutral100">
        <BaseHeaderLayout
          navigationAction={
            <Link startIcon={<ArrowLeft />} to="/">
              Go back
            </Link>
          }
          primaryAction={
            <DeployButton
              availabilityApiError={apiError}
              runDeployAvailability={availability?.runDeploy}
              onDeployed={onDeployed}
              website={website}
            />
          }
          title={headerTitle}
          subtitle={headerSubtitle}
          as="h2"
        />
      </Box>
      <SymmetricBox paddingHorizontal={10} paddingVertical={2}>
        {canListDeploy ? (
          <DeploymentsContainer
            usePolling={useDeploymentsPolling}
            onDeploymentsFetched={onDeploymentsFetched}
            website={website}
          />
        ) : (
          <DeploymentsEmptyState
            type={getDeploymentsEmptyStateType(
              apiError,
              availability?.listDeploy
            )}
          />
        )}
      </SymmetricBox>
    </Notifications>
  );
};

export default memo(HomePage);