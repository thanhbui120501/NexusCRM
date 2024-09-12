import { global_tokens } from "../styles/colors";
//import { radius } from "../styles/radius";
//import React from 'react';

import { spacings } from "../styles/spacings";
import { typography } from "../styles/typography";
//Define button style
const typeButtons = {
    neutral:{
        backgroundColor: global_tokens.gray.gray_900,
        color: global_tokens.base.white,
    },
    primary:{
        backgroundColor: global_tokens.orange.orange_600,
        color: global_tokens.base.white,
    },
    secondary:{
        backgroundColor: global_tokens.orange.orange_50,
        color: global_tokens.orange.orange_600,
    },
    tertiary:{
        backgroundColor: global_tokens.gray.gray_50,
        color: global_tokens.gray.gray_900,
        border: `1px solid ${global_tokens.gray.gray_200}`,

    },
    danger:{
        backgroundColor: global_tokens.red.red_600,
        color: global_tokens.base.white,
    },
};

//Define button size
const sizeStyles = {
    large: {
      padding: {
        top: spacings.spacing_6x,
        bot: spacings.spacing_6x,
        left: spacings.spacing_8x,
        right: spacings.spacing_8x
      },
      fontSize: typography.fontSize.body,
      fontWeight: typography.fontWeight.semibold
    },
    medium: {
        padding: {
            top: spacings.spacing_4x,
            bot: spacings.spacing_4x,
            left: spacings.spacing_8x,
            right: spacings.spacing_8x
          },
          fontSize: typography.fontSize.lable,
          fontWeight: typography.fontWeight.semibold
    },
    small: {
        padding: {
            top: spacings.spacing_4x,
            bot: spacings.spacing_4x,
            left: spacings.spacing_6x,
            right: spacings.spacing_6x
          },
          fontSize: typography.fontSize.tiny,
          fontWeight: typography.fontWeight.semibold
    },
  };
  



// const Button = ({
//   type = 'neutral',
//   size = 'medium',
//   state = 'default',
//   icon = 'none',
//   children,
//   onClick,
// }) => {
//   const StateButton = {
//     newtral: {
//       default: {},
//       hover:{
//         backgroundColor:global_tokens.gray.gray_800
//       },
//       press:{
//         backgroundColor: global_tokens.gray.gray_700
//       },
//       focus:{
//         border: radius.radius_md,
//         borderColor: global_tokens.gray.gray_200,
//         padding: '3px'
//       },
//       disabled:{
//         backgroundColor: global_tokens.gray.gray_300
//       }
//     },
//     primary: {
//       default: {},
//       hover:{
//         backgroundColor: global_tokens.orange.orange_700
//       },
//       press:{
//         backgroundColor: global_tokens.orange.orange_800
//       },
//       focus:{
//         border: radius.radius_md,
//         borderColor: global_tokens.orange.orange_200,
//         padding: '3px'
//       },
//       disabled:{
//         backgroundColor: global_tokens.gray.gray_300
//       }
//     },
//     hover: {
//       default: {},
//       hover:{
//         backgroundColor: global_tokens.orange.orange_100
//       },
//       press:{
//         backgroundColor: global_tokens.orange.orange_100
//       },
//       focus:{
//         border: radius.radius_md,
//         borderColor: global_tokens.orange.orange_50,
//         padding: '3px'
//       },
//       disabled:{
//         backgroundColor: global_tokens.gray.gray_300
//       }
//     },
//     tertiary: {
//       default: {},
//       hover:{
//         backgroundColor: global_tokens.gray.gray_100
//       },
//       press:{
//         backgroundColor: global_tokens.gray.gray_100
//       },
//       focus:{
//         border: radius.radius_md,
//         borderColor: global_tokens.gray.gray_300,
//         padding: '1px'
//       },
//       disabled:{
//         backgroundColor: global_tokens.gray.gray_50
//       }
//     },
//     danger: {
//       default: {},
//       hover:{
//         backgroundColor: global_tokens.red.red_700
//       },
//       press:{
//         backgroundColor: global_tokens.red.red_800
//       },
//       focus:{
//         border: radius.radius_md,
//         borderColor: global_tokens.red.red_200,
//         padding: '3px'
//       },
//       disabled:{
//         backgroundColor: global_tokens.gray.gray_300
//       }
//     },
//   }
// }

export {typeButtons, sizeStyles,}
