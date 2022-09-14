import React from "react";

import { Typography } from "@strapi/design-system/Typography";

import { useFormattedMessage } from "../../hooks/useFormattedMessage";

const FormattedMessage = ({ labelId, variant, textColor }) => {
  const label = useFormattedMessage(labelId);

  if (variant || textColor) {
    return (
      <Typography variant={variant} textColor={textColor}>
        {label}
      </Typography>
    );
  }

  return label;
};

export default FormattedMessage;