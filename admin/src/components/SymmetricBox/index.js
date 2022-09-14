/**
 *
 * SymmetricBox
 *
 */

 import React from "react";

 import { Box } from "@strapi/design-system/Box";
 
 const SymmetricBox = ({
   paddingHorizontal = 0,
   paddingVertical = 0,
   children,
 }) => {
   return (
     <Box
       paddingLeft={paddingHorizontal}
       paddingRight={paddingHorizontal}
       paddingTop={paddingVertical}
       paddingBottom={paddingVertical}
     >
       {children}
     </Box>
   );
 };
 
 export default SymmetricBox;