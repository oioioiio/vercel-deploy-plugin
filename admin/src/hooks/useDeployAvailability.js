import { useState, useEffect } from "react";

import { deployAvailability } from "../utils/api";

export function useDeployAvailability(website) {

  const initialAvailability = {};
  const [availability, setAvailability] = useState(initialAvailability);

  const [apiError, setApiError] = useState(undefined);
  const [isLoadingAvailability, setIsLoadingAvailability] = useState(true);

  useEffect(() => {
    deployAvailability({ params: { locale: website } })
      .then((response) => {
        setAvailability(response.data);
      })
      .catch((error) => {
        console.error(
          "[vercel-deploy] error while retrieving availability",
          error
        );
        setAvailability({});
        if (error && error.response && error.response.status === 403) {
          setApiError("FORBIDDEN");
        } else {
          setApiError("GENERIC_ERROR");
        }
      })
      .finally(() => {
        setIsLoadingAvailability(false);
      });
  }, [setIsLoadingAvailability, setAvailability]);

  return [isLoadingAvailability, availability, apiError];
}