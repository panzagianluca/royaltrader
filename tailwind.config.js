/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: ['class', "class"],
  theme: {
  	extend: {
  		colors: {
  			border: "hsl(var(--border))",
  			input: "hsl(var(--input))",
  			ring: "hsl(var(--ring))",
  			background: "hsl(var(--background))",
  			foreground: "hsl(var(--foreground))",
  			primary: {
  				DEFAULT: "hsl(var(--primary))",
  				foreground: "hsl(var(--primary-foreground))",
  			},
  			secondary: {
  				DEFAULT: "hsl(var(--secondary))",
  				foreground: "hsl(var(--secondary-foreground))",
  			},
  			destructive: {
  				DEFAULT: "hsl(var(--destructive))",
  				foreground: "hsl(var(--destructive-foreground))",
  			},
  			muted: {
  				DEFAULT: "hsl(var(--muted))",
  				foreground: "hsl(var(--muted-foreground))",
  			},
  			accent: {
  				DEFAULT: "hsl(var(--accent))",
  				foreground: "hsl(var(--accent-foreground))",
  			},
  			popover: {
  				DEFAULT: "hsl(var(--popover))",
  				foreground: "hsl(var(--popover-foreground))",
  			},
  			card: {
  				DEFAULT: "hsl(var(--card))",
  				foreground: "hsl(var(--card-foreground))",
  			},
  			violet: {
  				'1': 'var(--violet-1)',
  				'2': 'var(--violet-2)',
  				'3': 'var(--violet-3)',
  				'4': 'var(--violet-4)',
  				'5': 'var(--violet-5)',
  				'6': 'var(--violet-6)',
  				'7': 'var(--violet-7)',
  				'8': 'var(--violet-8)',
  				'9': 'var(--violet-9)',
  				'10': 'var(--violet-10)',
  				'11': 'var(--violet-11)',
  				'12': 'var(--violet-12)'
  			},
  			violetA: {
  				'1': 'var(--violet-a1)',
  				'2': 'var(--violet-a2)',
  				'3': 'var(--violet-a3)',
  				'4': 'var(--violet-a4)',
  				'5': 'var(--violet-a5)',
  				'6': 'var(--violet-a6)',
  				'7': 'var(--violet-a7)',
  				'8': 'var(--violet-a8)',
  				'9': 'var(--violet-a9)',
  				'10': 'var(--violet-a10)',
  				'11': 'var(--violet-a11)',
  				'12': 'var(--violet-a12)'
  			},
  			blue: {
  				'1': 'var(--blue-1)',
  				'2': 'var(--blue-2)',
  				'3': 'var(--blue-3)',
  				'4': 'var(--blue-4)',
  				'5': 'var(--blue-5)',
  				'6': 'var(--blue-6)',
  				'7': 'var(--blue-7)',
  				'8': 'var(--blue-8)',
  				'9': 'var(--blue-9)',
  				'10': 'var(--blue-10)',
  				'11': 'var(--blue-11)',
  				'12': 'var(--blue-12)'
  			},
  			blueA: {
  				'1': 'var(--blue-a1)',
  				'2': 'var(--blue-a2)',
  				'3': 'var(--blue-a3)',
  				'4': 'var(--blue-a4)',
  				'5': 'var(--blue-a5)',
  				'6': 'var(--blue-a6)',
  				'7': 'var(--blue-a7)',
  				'8': 'var(--blue-a8)',
  				'9': 'var(--blue-a9)',
  				'10': 'var(--blue-a10)',
  				'11': 'var(--blue-a11)',
  				'12': 'var(--blue-a12)'
  			},
  			gray: {
  				'1': 'var(--gray-1)',
  				'2': 'var(--gray-2)',
  				'3': 'var(--gray-3)',
  				'4': 'var(--gray-4)',
  				'5': 'var(--gray-5)',
  				'6': 'var(--gray-6)',
  				'7': 'var(--gray-7)',
  				'8': 'var(--gray-8)',
  				'9': 'var(--gray-9)',
  				'10': 'var(--gray-10)',
  				'11': 'var(--gray-11)',
  				'12': 'var(--gray-12)'
  			},
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			},
  			sidebar: {
  				DEFAULT: 'hsl(var(--sidebar-background))',
  				foreground: 'hsl(var(--sidebar-foreground))',
  				primary: 'hsl(var(--sidebar-primary))',
  				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
  				accent: 'hsl(var(--sidebar-accent))',
  				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
  				border: 'hsl(var(--sidebar-border))',
  				ring: 'hsl(var(--sidebar-ring))'
  			}
  		},
  		textColor: {
  			primary: 'var(--violet-12)',
  			secondary: 'var(--violet-11)'
  		},
  		borderRadius: {
  			lg: "var(--radius)",
  			md: "calc(var(--radius) - 2px)",
  			sm: "calc(var(--radius) - 4px)"
  		},
  		keyframes: {
  			"accordion-down": {
  				from: { height: "0" },
  				to: { height: "var(--radix-accordion-content-height)" },
  			},
  			"accordion-up": {
  				from: { height: "var(--radix-accordion-content-height)" },
  				to: { height: "0" },
  			}
  		},
  		animation: {
  			"accordion-down": "accordion-down 0.2s ease-out",
  			"accordion-up": "accordion-up 0.2s ease-out"
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
}
