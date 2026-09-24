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
        // Primary
        saffron: "#E85D04",
        templeOrange: "#F48C06",
        marigold: "#F9C74F",
        turmeric: "#F4D35E",
        
        // Spiritual
        kumkum: "#B23A48",
        vermilion: "#C73E1D",
        deepRed: "#8F1D14",
        plum: "#6D214F",
        purple: "#7B2CBF",
        
        // Nature
        tulsi: "#588157",
        sacredGreen: "#386641",
        leaf: "#6A994E",
        
        // Accent
        peacock: "#168AAD",
        templeTeal: "#2A9D8F",
        deepPeacock: "#155D6B",
        
        // Earth
        sandalwood: "#A67C52",
        earthBrown: "#6B4226",
        antiqueGold: "#C89B3C",
        
        // Neutral
        sacredCream: "#FFF8E7",
        charcoal: "#292524",
      },
      fontFamily: {
        display: ["'Playfair Display'", "var(--font-cormorant)", "Georgia", "serif"],
        playfair: ["'Playfair Display'", "Georgia", "serif"],
        cinzel: ["'Cinzel'", "Georgia", "serif"],
        cormorant: ["var(--font-cormorant)", "Georgia", "serif"],
        sans: ["var(--font-manrope)", "Arial", "sans-serif"],
        manrope: ["var(--font-manrope)", "Arial", "sans-serif"],
      },
      boxShadow: {
        'solid-sm': '2px 2px 0px #6B4226',
        'solid-md': '4px 4px 0px #6B4226',
        'solid-gold': '3px 3px 0px #C89B3C',
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
