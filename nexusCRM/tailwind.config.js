/* eslint-disable no-unused-vars */
/** @type {import('tailwindcss').Config} */
import {typography} from './src/styles/typography';
// eslint-disable-next-line no-unused-vars
import {color_variables} from './src/styles/colors';
export default {
  content: ["./index.html","./src/**/*.{js,ts,jsx,tsx}",],
  theme: {   
    fontFamily: {     
      'sans': ['Inter', 'sans-serif'],
    },
    // height:{
    //   'left-login-top-height':'64px',
    //   'left-login-bottom-height':'352px',
    // },
    // width:{
    //   'left-login-width': '448px',
    //   'right-login-width': '992px',      
    // },
    // fontSize:{
    //   'app-name-size': typography.fontSize.display_xs,
    //   'login-size': typography.fontSize.display_md,
    // },
    // fontWeight:{
    //   'login-title': typography.fontWeight.semibold
    // }
    extend: {
      
     },
  },
  
  plugins: [],
}

