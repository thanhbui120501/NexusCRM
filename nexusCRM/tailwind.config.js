/* eslint-disable no-unused-vars */
/** @type {import('tailwindcss').Config} */
import { typography } from "./src/styles/typography";
import { color_variables } from "./src/styles/colors";
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        fontFamily: {
            sans: ["Inter", "sans-serif"],
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
            colors: {
                "dark-purple": "#081A51",
                "light-white": "rgba(255,255,255,0.18)",
            },
            boxShadow: {
                custom: "0px 4px 8px 0px rgba(0, 0, 0, 0.1)", // Thêm màu nếu cần
            },
        },
    },

    plugins: [],
};
