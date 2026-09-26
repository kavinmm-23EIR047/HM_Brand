import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        // Precise HM Brand Solid Palette
        sandal: "#FFF4D6",
        sandalLight: "#FFF8E7",
        saffron: "#F47A20",
        maroon: "#9E1830",
        green: "#3F7D45",
        lightGreen: "#DDECCB",
        blue: "#4C7FA8",
        violet: "#7653A6",
        yellow: "#F6C84C",
        darkText: "#173B3A",

        // Legacy Aliases
        sacredCream: "#FFF4D6",
        charcoal: "#173B3A",
        earthBrown: "#9E1830",
        antiqueGold: "#F6C84C",
        tulsi: "#3F7D45",
        sacredGreen: "#3F7D45",
        leaf: "#3F7D45",
      },
      fontFamily: {
        sans: ["'Plus Jakarta Sans'", "sans-serif"],
        heading: ["'Outfit'", "'DM Sans'", "sans-serif"],
        display: ["'Outfit'", "'DM Sans'", "sans-serif"],
        script: ["'Caveat'", "'Playfair Display'", "cursive"],
        playfair: ["'Playfair Display'", "Georgia", "serif"],
        label: ["'Space Grotesk'", "sans-serif"],
        space: ["'Space Grotesk'", "sans-serif"],
      },
      boxShadow: {
        'solid-sm': '2px 2px 0px #9E1830',
        'solid-md': '4px 4px 0px #9E1830',
        'solid-gold': '3px 3px 0px #F6C84C',
        'card': '0 6px 24px -4px rgba(23, 59, 58, 0.07)',
      },
      keyframes: {
        sway: {
          '0%, 100%': { transform: 'rotate(-5deg)' },
          '50%': { transform: 'rotate(5deg)' },
        }
      },
      animation: {
        'sway': 'sway 4s ease-in-out infinite',
      }
    },
  },
  plugins: [],
};

export default config;
