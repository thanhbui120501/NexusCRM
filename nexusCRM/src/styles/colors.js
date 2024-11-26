const global_tokens = {
    blue: {
        blue_50: "#EFF6FF",
        blue_100: "#DBEAFE",
        blue_200: "#BFDBFE",
        blue_300: "#93C5FD",
        blue_400: "#60A5FA",
        blue_500: "#3B82F6",
        blue_600: "#2563EB",
        blue_700: "#1D4ED8",
        blue_800: "#1E40AF",
        blue_900: "#1E3A8A",
    },
    green: {
        green_50: "#F0FDF4",
        green_100: "#DCFCE7",
        green_200: "#BBF7D0",
        green_300: "#86EFAC",
        green_400: "#4ADE80",
        green_500: "#22C55E",
        green_600: "#16A34A",
        green_700: "#15803D",
        green_800: "#166534",
        green_900: "#14532D",
    },
    orange: {
        orange_50: "#FFF7ED",
        orange_100: "#FFEDD5",
        orange_200: "#FED7AA",
        orange_300: "#FDBA74",
        orange_400: "#FB923C",
        orange_500: "#F97316",
        orange_600: "#EA580C",
        orange_700: "#C2410C",
        orange_800: "#9A3412",
        orange_900: "#7C2D12",
    },
    red: {
        red_50: "#FEF2F2",
        red_100: "#FEE2E2",
        red_200: "#FECACA",
        red_300: "#FCA5A5",
        red_400: "#F87171",
        red_500: "#EF4444",
        red_600: "#DC2626",
        red_700: "#B91C1C",
        red_800: "#991B1B",
        red_900: "#7F1D1D",
    },
    yellow: {
        yellow_50: "#FEFCE8",
        yellow_100: "#FEF9C3",
        yellow_200: "#FEF08A",
        yellow_300: "#FDE047",
        yellow_400: "#FACC15",
        yellow_500: "#EAB308",
        yellow_600: "#CA8A04",
        yellow_700: "#A16207",
        yellow_800: "#854D0E",
        yellow_900: "#713F12",
    },
    sky: {
        sky_50: "#F0F9FF",
        sky_100: "#E0F2FE",
        sky_200: "#BAE6FD",
        sky_300: "#7DD3FC",
        sky_400: "#38BDF8",
        sky_500: "#0EA5E9",
        sky_600: "#0284C7",
        sky_700: "#0369A1",
        sky_800: "#075985",
        sky_900: "#0C4A6E",
    },
    purple: {
        purple_50: "#FAF5FF",
        purple_100: "#FAE8FF",
        purple_200: "#F5D0FE",
        purple_300: "#F0ABFC",
        purple_400: "#E879F9",
        purple_500: "#D946EF",
        purple_600: "#C026D3",
        purple_700: "#A21CAF",
        purple_800: "#86198F",
        purple_900: "#701A75",
    },
    pink: {
        pink_50: "#FDF2F8",
        pink_100: "#FCE7F3",
        pink_200: "#FBCFE8",
        pink_300: "#F9A8D4",
        pink_400: "#F472B6",
        pink_500: "#EC4899",
        pink_600: "#DB2777",
        pink_700: "#BE185D",
        pink_800: "#9D174D",
        pink_900: "#831843",
    },
    gray: {
        gray_50: "#FAFAFA",
        gray_100: "#F5F5F5",
        gray_200: "#E5E5E5",
        gray_300: "#D4D4D4",
        gray_400: "#A3A3A3",
        gray_500: "#737373",
        gray_600: "#525252",
        gray_700: "#404040",
        gray_800: "#262626",
        gray_900: "#171717",
    },
    base: {
        white: "#FFFFFF",
        black: "#000000",
    },
};

const alias_tokens = {
    brand: {
        brand_50: global_tokens.orange.orange_50,
        brand_100: global_tokens.orange.orange_100,
        brand_200: global_tokens.orange.orange_200,
        brand_300: global_tokens.orange.orange_300,
        brand_400: global_tokens.orange.orange_400,
        brand_500: global_tokens.orange.orange_500,
        brand_600: global_tokens.orange.orange_600,
        brand_700: global_tokens.orange.orange_700,
        brand_800: global_tokens.orange.orange_800,
        brand_900: global_tokens.orange.orange_900,
    },
    positive: {
        positive_50: global_tokens.green.green_50,
        positive_100: global_tokens.green.green_100,
        positive_200: global_tokens.green.green_200,
        positive_300: global_tokens.green.green_300,
        positive_400: global_tokens.green.green_400,
        positive_500: global_tokens.green.green_500,
        positive_600: global_tokens.green.green_600,
        positive_700: global_tokens.green.green_700,
        positive_800: global_tokens.green.green_800,
        positive_900: global_tokens.green.green_900,
    },
    warning: {
        warning_50: global_tokens.yellow.yellow_50,
        warning_100: global_tokens.yellow.yellow_100,
        warning_200: global_tokens.yellow.yellow_200,
        warning_300: global_tokens.yellow.yellow_300,
        warning_400: global_tokens.yellow.yellow_400,
        warning_500: global_tokens.yellow.yellow_500,
        warning_600: global_tokens.yellow.yellow_600,
        warning_700: global_tokens.yellow.yellow_700,
        warning_800: global_tokens.yellow.yellow_800,
        warning_900: global_tokens.yellow.yellow_900,
    },
    negative: {
        negative_50: global_tokens.red.red_50,
        negative_100: global_tokens.red.red_100,
        negative_200: global_tokens.red.red_200,
        negative_300: global_tokens.red.red_300,
        negative_400: global_tokens.red.red_400,
        negative_500: global_tokens.red.red_500,
        negative_600: global_tokens.red.red_600,
        negative_700: global_tokens.red.red_700,
        negative_800: global_tokens.red.red_800,
        negative_900: global_tokens.red.red_900,
    },
    info: {
        info_50: global_tokens.blue.blue_50,
        info_100: global_tokens.blue.blue_100,
        info_200: global_tokens.blue.blue_200,
        info_300: global_tokens.blue.blue_300,
        info_400: global_tokens.blue.blue_400,
        info_500: global_tokens.blue.blue_500,
        info_600: global_tokens.blue.blue_600,
        info_700: global_tokens.blue.blue_700,
        info_800: global_tokens.blue.blue_800,
        info_900: global_tokens.blue.blue_900,
    },
    neutral: {
        neutral_50: global_tokens.gray.gray_50,
        neutral_100: global_tokens.gray.gray_100,
        neutral_200: global_tokens.gray.gray_200,
        neutral_300: global_tokens.gray.gray_300,
        neutral_400: global_tokens.gray.gray_400,
        neutral_500: global_tokens.gray.gray_500,
        neutral_600: global_tokens.gray.gray_600,
        neutral_700: global_tokens.gray.gray_700,
        neutral_800: global_tokens.gray.gray_800,
        neutral_900: global_tokens.gray.gray_900,
    },
};

const color_variables = {
    text: {
        primary: alias_tokens.neutral.neutral_900,
        white: global_tokens.base.white,
        black: global_tokens.base.black,
        secondary: alias_tokens.neutral.neutral_400,
        gray: alias_tokens.neutral.neutral_500,
        brand: alias_tokens.brand.brand_600,
        positive: alias_tokens.positive.positive_600,
        warning: alias_tokens.warning.warning_600,
        yellow: alias_tokens.warning.warning_500,
        negative: alias_tokens.negative.negative_600,
        info: alias_tokens.info.info_600,
    },
    background: {
        surface_default: global_tokens.base.white,
        black: global_tokens.base.black,
        brand: {
            default: alias_tokens.brand.brand_600,
            hover: alias_tokens.brand.brand_700,
            press: alias_tokens.brand.brand_800,
            subtle: alias_tokens.brand.brand_50,
            subtle_hover: alias_tokens.brand.brand_100,
            subtle_press: alias_tokens.brand.brand_100,
            disable: alias_tokens.brand.brand_400,
            focus: alias_tokens.brand.brand_200,
            subtle_disabled: alias_tokens.brand.brand_300,
            medium: alias_tokens.brand.brand_500,
        },
        neutral: {
            default: alias_tokens.neutral.neutral_900,
            hover: alias_tokens.neutral.neutral_800,
            press: alias_tokens.neutral.neutral_700,
            subtle: alias_tokens.neutral.neutral_50,
            subtle_hover: alias_tokens.neutral.neutral_100,
            subtle_press: alias_tokens.neutral.neutral_100,
            disable: alias_tokens.neutral.neutral_400,
            subtle_disabled: alias_tokens.neutral.neutral_300,
        },
        positive: {
            default: alias_tokens.positive.positive_600,
            hover: alias_tokens.positive.positive_700,
            press: alias_tokens.positive.positive_800,
            subtle: alias_tokens.positive.positive_50,
            subtle_hover: alias_tokens.positive.positive_100,
            subtle_press: alias_tokens.positive.positive_100,
        },
        warning: {
            default: alias_tokens.warning.warning_600,
            hover: alias_tokens.warning.warning_700,
            press: alias_tokens.warning.warning_800,
            subtle: alias_tokens.warning.warning_50,
            subtle_hover: alias_tokens.warning.warning_100,
            subtle_press: alias_tokens.warning.warning_100,
        },
        negative: {
            default: alias_tokens.negative.negative_600,
            hover: alias_tokens.negative.negative_700,
            press: alias_tokens.negative.negative_800,
            subtle: alias_tokens.negative.negative_50,
            subtle_hover: alias_tokens.negative.negative_100,
            subtle_press: alias_tokens.negative.negative_100,
        },
        info: {
            default: alias_tokens.info.info_600,
            hover: alias_tokens.info.info_700,
            press: alias_tokens.info.info_800,
            subtle: alias_tokens.info.info_50,
            subtle_hover: alias_tokens.info.info_100,
            subtle_press: alias_tokens.info.info_100,
        },
    },
    border: {
        gray: alias_tokens.neutral.neutral_500,
        white: global_tokens.base.white,
        neutral: {
            default: alias_tokens.neutral.neutral_200,
            hover: alias_tokens.neutral.neutral_200,
            press: alias_tokens.neutral.neutral_300,
            focus: alias_tokens.neutral.neutral_200,
            subtle: alias_tokens.neutral.neutral_200,
            subtle_hover: alias_tokens.neutral.neutral_100
        },
        brand: {
            default: alias_tokens.brand.brand_600,
            focus: alias_tokens.brand.brand_200,
        },
        positive: {
            default: alias_tokens.positive.positive_600,
            focus: alias_tokens.positive.positive_200,
        },
        warning: {
            default: alias_tokens.warning.warning_600,
            focus: alias_tokens.warning.warning_200,
        },
        negative: {
            default: alias_tokens.negative.negative_600,
            focus: alias_tokens.negative.negative_200,
        },
        info: {
            default: alias_tokens.info.info_600,
            focus: alias_tokens.info.info_200,
        },
    },
};

export default { global_tokens, alias_tokens, color_variables };
