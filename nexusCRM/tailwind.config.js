/** @type {import('tailwindcss').Config} */
//import { typography } from "./src/styles/typography";
import color_variables from "./src/styles/colors";
//console.log(color_variables.color_variables.background.brand);
const addColors = (colorObj) => {
    const colors = {};
    Object.keys(colorObj).forEach((key) => {
        const value = colorObj[key];
        if (typeof value === "object") {
            colors[key] = addColors(value); // Đệ quy cho các nhóm con (object)
        } else {
            colors[key] = value; // Thêm màu trực tiếp nếu là giá trị đơn
        }
    });
    return colors;
};

export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        fontFamily: {
            sans: ["Inter", "sans-serif"],
        },
        extend: {
            colors: {
                ...addColors(color_variables.color_variables),
            },
            boxShadow: {
                custom: "0px 4px 8px 0px rgba(0, 0, 0, 0.1)", // Thêm màu nếu cần
            },
        },
    },

    plugins: [],
};
