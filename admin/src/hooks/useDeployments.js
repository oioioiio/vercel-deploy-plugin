import { useEffect, useState } from "react";

import { useInterval } from "./useInterval";
import { getDeployments } from "../utils/api";

const INTERVAL_DELAY = 1000;

const finalStates = ["CANCELED", "ERROR", "READY"];

const containsNonFinalState = (deployments) => {
  const nonFinalStateIndex = deployments.findIndex(
    (d) => !finalStates.includes(d.state)
  );
  return nonFinalStateIndex >= 0;
};


export function useDeployments(usePolling, onDeploymentsFetched,website) {

  const initialDeployments = [];
  const [deployments, setDeployments] = useState(initialDeployments);
  const [hasError, setHasError] = useState(false);
  const [isLoadingDeployments, setIsLoadingDeployments] = useState(true);


  const triggerCallback = (deployments) => {
    if (!onDeploymentsFetched) return;
    const hasNonFinalState = containsNonFinalState(deployments);
    onDeploymentsFetched(hasNonFinalState);
  };

  const fetchDeployments = () => {
    getDeployments({ params: { locale: website } })
      .then((response) => {
        setDeployments(response.deployments);
        triggerCallback(response.deployments);
      })
      .catch((error) => {
        console.error(
          "[vercel-deploy] error while retrieving deployments",
          error
        );
        setHasError(true);
        setDeployments([]);
        triggerCallback([]);
      })
      .finally(() => {
        setIsLoadingDeployments(false);
      });
  };

  useEffect(() => {
    if (!usePolling) {
      fetchDeployments();
    }
  }, [
    setDeployments,
    setIsLoadingDeployments,
    usePolling,
    onDeploymentsFetched,
  ]);

  const delay = usePolling ? INTERVAL_DELAY : null;
  useInterval(() => {
    fetchDeployments();
  }, delay);

  return [isLoadingDeployments, deployments, hasError];
}