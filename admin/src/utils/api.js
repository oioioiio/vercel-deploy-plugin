import axios from "./axiosInstance";
import pluginId from "../pluginId";

export const runDeploy = async ({ params  }) => {
  try {
    const data = await axios(`/${pluginId}/deploy/run`, { method: "GET", params });
    return data.data;
  } catch (error) {
    console.error("[vercel-deploy] Error while running a deploy -", error);
    throw error;
  }
};


export const getConfig = async () => {
  try {
    const response = await axios(`/${pluginId}/config`, { method: "GET" });
    return response.data;
  } catch (error) {
    console.error("[vercel-deploy] Error while fetching configs -", error);
    throw error;
  }
};


export const getDeployments = async ({ params }) => {
  try {
    const response = await axios(`/${pluginId}/deploy/list`, { method: "GET", params });
    return response.data;
  } catch (error) {
    console.error(
      "[vercel-deploy] Error while fetching deployments list -",
      error
    );
    throw error;
  }
};


export const deployAvailability = async ({ params }) => {
  try {
    const response = await axios(`/${pluginId}/deploy/availability`, {
      method: "GET", params
    });
    return response.data;
  } catch (error) {
    console.error(
      "[vercel-deploy]: Error while fetching deploy availability -",
      error
    );
    throw error;
  }
};