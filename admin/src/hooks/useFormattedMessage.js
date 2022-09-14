
import { useIntl } from "react-intl";

import getTrad from "../utils/getTrad";

export const useFormattedMessage = (labelId) => {
  const { formatMessage } = useIntl();
  const label = formatMessage({ id: getTrad(labelId) });
  return label;
};