import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:"#F6FBFF",
          100:"#EAF6FF",
          200:"#D4EBFE",
          300:"#B5DCFD",
          400:"#7EC1FA",
          500:"#55A9F3",
          600:"#3D8DD5",
          700:"#2F6FA8",
          800:"#295C88",
          900:"#234B6E"
        },
        mint: {
          100:"#E8FBF4",
          300:"#BDF3E0",
          500:"#64D7B0"
        },
        peach: {
          100:"#FFF2EC",
          300:"#FFD6C6",
          500:"#FFA987"
        },
      },
      borderRadius: {
        xl:"1rem",
        "2xl":"1.25rem",
        "3xl":"1.5rem"
      },
      boxShadow: {
        soft: "0 10px 30px rgba(20,120,220,.08)"
      },
    },
  },
  plugins: [],
} satisfies Config;