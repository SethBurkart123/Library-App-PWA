/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
	theme: {
		extend: {
			colors: {
				primary: {
					DEFAULT: '#EAB567',
					'50': '#FFFFFF',
					'100': '#FEFBF6',
					'200': '#F9E9D3',
					'300': '#F4D8AF',
					'400': '#EFC68B',
					'500': '#EAB567',
					'600': '#E39D36',
					'700': '#C6811B',
					'800': '#946114',
					'900': '#63400E',
				},
				secondary: {
					DEFAULT: '#0E0E18',
					'50': '#52528C',
					'100': '#4A4A7F',
					'200': '#3B3B65',
					'300': '#2C2C4C',
					'400': '#1D1D32',
					'500': '#0E0E18',
					'600': '#000000',
					'700': '#000000',
					'800': '#000000',
					'900': '#000000'
				},
				main: {
					DEFAULT: '#182222',
				},
        gray: {
          100: '#FBFBFB',
          200: '#EAEAEA',
          300: '#DFDFDF',
          400: '#999999',
          500: '#7F7F7F',
          600: '#666666',
          700: '#4C4C4C',
          800: '#333333',
          900: '#191919',
        },
        blue: {
          100: '#E6F0FD',
          200: '#CCE2FC',
          300: '#99C5FA',
          400: '#66A9F7',
          500: '#338CF5',
          600: '#0070F4',
          700: '#0064DA',
          800: '#0059C2',
          900: '#004391',
        },
        teal: {
          100: '#E6FFFA',
          200: '#B2F5EA',
          300: '#81E6D9',
          400: '#4FD1C5',
          500: '#3ABAB4',
          600: '#319795',
          700: '#2C7A7B',
          800: '#285E61',
          900: '#234E52',
        },
			},	
      boxShadow: {
        xs: '0 0 0 1px rgba(0, 0, 0, 0.16)',
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.16)',
        default: '0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.04), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.04), 0 4px 6px -2px rgba(0, 0, 0, 0.02)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.12), 0 10px 10px -5px rgba(0, 0, 0, 0.02)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
        inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.04)',
        outline: '0 0 0 3px rgba(66, 153, 225, 0.5)',
        none: 'none',
      },
      spacing: {
        '9/16': '56.25%',
        '3/4': '75%',
        '1/1': '100%',
      },
      inset: {
        '1/2': '50%',
        'full': '100%',
      },
      letterSpacing: {
        tighter: '-0.02em',
        tight: '-0.01em',
        normal: '0',
        wide: '0.01em',
        wider: '0.02em',
        widest: '0.4em',
      },
      lineHeight: {
        none: '1',
        tighter: '1.125',
        tight: '1.25',
        snug: '1.375',
        normal: '1.5',
        relaxed: '1.625',
        loose: '2',
        '3': '.75rem',
        '4': '1rem',
        '5': '1.2rem',
        '6': '1.5rem',
        '7': '1.75rem',
        '8': '2rem',
        '9': '2.25rem',
        '10': '2.5rem',
      },
      minWidth: {
        '10': '2.5rem',
        '48': '12rem',
      },
      opacity: {
        '90': '0.9',
      },
      scale: {
        '98': '.98'
      },
      animation: {
        float: 'float 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)', },
          '50%': { transform: 'translateY(-5%)', },
        },
      },
      zIndex: {
        '-1': '-1',
        '60': '60'
      },
      height: {
        '7.5': '30px',
        '8.5': '34px',
        '9.5': '38px',
        '10.5': '42px',
		'0.25vh': '0.25vh',
		'0.5vh': '0.5vh',
		'0.75vh': '0.75vh',
		'1vh': '1vh',
		'1.25vh': '1.25vh',
		'1.5vh': '1.5vh',
		'1.75vh': '1.75vh',
		'2vh': '2vh',
		'2.5vh': '2.5vh',
		'3vh': '3vh',
		'3.5vh': '3.5vh',
		'4vh': '4vh',
		'4.5vh': '4.5vh',
		'5vh': '5vh',
		'6vh': '6vh',
		'7vh': '7vh',
		'8vh': '8vh',
		'9vh': '9vh',
		'10vh': '10vh',
		'11vh': '11vh',
		'12vh': '12vh',
		'13vh': '13vh',
		'14vh': '14vh',
		'15vh': '15vh',
		'16vh': '16vh',
		'17vh': '17vh',
		'18vh': '18vh',
		'19vh': '19vh',
		'20vh': '20vh',
		'25vh': '25vh',
		'30vh': '30vh',
		'35vh': '35vh',
		'40vh': '40vh',
		'45vh': '45vh',
		'50vh': '50vh',
		'55vh': '55vh',
		'60vh': '60vh',
		'65vh': '65vh',
		'70vh': '70vh',
		'75vh': '75vh',
		'80vh': '80vh',
		'85vh': '85vh',
		'90vh': '90vh',
		'95vh': '95vh',
		'96vh': '96vh',
		'97vh': '97vh',
		'98vh': '98vh',
		'99vh': '99vh',
		'100vh': '100vh',
      },
			fontSize: {
				'4.5xl': '2.5rem',
				'7xl': '5rem',
				'8xl': '6rem',
				'9xl': '7rem',
				'10xl': '8rem',
				'1vh': '1vh',
				'1.25vh': '1.25vh',
				'1.5vh': '1.5vh',
				'1.75vh': '1.75vh',
				'2vh': '2vh',
				'2.5vh': '2.5vh',
				'3vh': '3vh',
				'3.5vh': '3.5vh',
				'4vh': '4vh',
				'4.5vh': '4.5vh',
				'5vh': '5vh',
				'5.5vh': '5.5vh',
				'6vh': '6vh',
				'6.5vh': '6.5vh',
				'7vh': '7vh',
				'7.5vh': '7.5vh',
				'8vh': '8vh',
				'8.5vh': '8.5vh',
				'9vh': '9vh',
				'10vh': '10vh',
				'11vh': '11vh',
				'12vh': '12vh',
				'13vh': '13vh',
				'14vh': '14vh',
				'15vh': '15vh',
				'16vh': '16vh',
				'17vh': '17vh',
				'18vh': '18vh',
				'19vh': '19vh',
				'20vh': '20vh',
				'21vh': '21vh',
				'22vh': '22vh',
				'23vh': '23vh',
				'24vh': '24vh',
				'25vh': '25vh',
				'26vh': '26vh',
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
        '4xl': '2.625rem',
        '5xl': '3.25rem',
        '6xl': '5.5rem',
			},
			left: {
				'18': '4.5rem',
				'75': '18.75rem',
				'0.25vh': '0.25vh',
				'0.5vh': '0.5vh',
				'0.75vh': '0.75vh',
				'1vh': '1vh',
				'1.25vh': '1.25vh',
				'1.5vh': '1.5vh',
				'1.75vh': '1.75vh',
				'2vh': '2vh',
				'2.5vh': '2.5vh',
				'3vh': '3vh',
				'3.5vh': '3.5vh',
				'4vh': '4vh',
				'4.5vh': '4.5vh',
				'5vh': '5vh',
				'6vh': '6vh',
				'7vh': '7vh',
				'8vh': '8vh',
				'9vh': '9vh',
				'10vh': '10vh',
				'11vh': '11vh',
				'12vh': '12vh',
				'13vh': '13vh',
				'14vh': '14vh',
				'15vh': '15vh',
				'16vh': '16vh',
				'17vh': '17vh',
				'18vh': '18vh',
				'19vh': '19vh',
				'20vh': '20vh',
				'25vh': '25vh',
				'30vh': '30vh',
				'35vh': '35vh',
				'40vh': '40vh',
				'45vh': '45vh',
				'50vh': '50vh',
				'55vh': '55vh',
				'60vh': '60vh',
				'65vh': '65vh',
				'70vh': '70vh',
				'75vh': '75vh',
				'80vh': '80vh',
				'85vh': '85vh',
				'90vh': '90vh',
				'95vh': '95vh',
				'100vh': '100vh',
			},
			width: {
				'18': '4.5rem',
				'75': '18.75rem',
				'0.25vh': '0.25vh',
				'0.5vh': '0.5vh',
				'0.75vh': '0.75vh',
				'1vh': '1vh',
				'1.25vh': '1.25vh',
				'1.5vh': '1.5vh',
				'1.75vh': '1.75vh',
				'2vh': '2vh',
				'2.5vh': '2.5vh',
				'3vh': '3vh',
				'3.5vh': '3.5vh',
				'4vh': '4vh',
				'4.5vh': '4.5vh',
				'5vh': '5vh',
				'6vh': '6vh',
				'7vh': '7vh',
				'8vh': '8vh',
				'9vh': '9vh',
				'10vh': '10vh',
				'11vh': '11vh',
				'12vh': '12vh',
				'13vh': '13vh',
				'14vh': '14vh',
				'15vh': '15vh',
				'16vh': '16vh',
				'17vh': '17vh',
				'18vh': '18vh',
				'19vh': '19vh',
				'20vh': '20vh',
				'25vh': '25vh',
				'30vh': '30vh',
				'35vh': '35vh',
				'40vh': '40vh',
				'45vh': '45vh',
				'50vh': '50vh',
				'55vh': '55vh',
				'60vh': '60vh',
				'65vh': '65vh',
				'70vh': '70vh',
				'75vh': '75vh',
				'80vh': '80vh',
				'85vh': '85vh',
				'90vh': '90vh',
				'95vh': '95vh',
				'96vh': '96vh',
				'97vh': '97vh',
				'98vh': '98vh',
				'99vh': '99vh',
				'100vh': '100vh',
				'7.5': '30px',
				'8.5': '34px',
				'9.5': '38px',
				'10.5': '42px',
			},
			padding: {
				'18': '4.5rem',
				'75': '18.75rem',
				'0.25vh': '0.25vh',
				'0.5vh': '0.5vh',
				'0.75vh': '0.75vh',
				'1vh': '1vh',
				'1.25vh': '1.25vh',
				'1.5vh': '1.5vh',
				'1.75vh': '1.75vh',
				'2vh': '2vh',
				'2.5vh': '2.5vh',
				'3vh': '3vh',
				'3.5vh': '3.5vh',
				'4vh': '4vh',
				'4.5vh': '4.5vh',
				'5vh': '5vh',
				'6vh': '6vh',
				'7vh': '7vh',
				'8vh': '8vh',
				'9vh': '9vh',
				'10vh': '10vh',
				'11vh': '11vh',
				'12vh': '12vh',
				'13vh': '13vh',
				'14vh': '14vh',
				'15vh': '15vh',
				'16vh': '16vh',
				'17vh': '17vh',
				'18vh': '18vh',
				'19vh': '19vh',
				'20vh': '20vh',
				'25vh': '25vh',
				'30vh': '30vh',
				'35vh': '35vh',
				'40vh': '40vh',
				'45vh': '45vh',
				'50vh': '50vh',
				'55vh': '55vh',
				'60vh': '60vh',
				'65vh': '65vh',
				'70vh': '70vh',
				'75vh': '75vh',
				'80vh': '80vh',
				'85vh': '85vh',
				'90vh': '90vh',
				'95vh': '95vh',
				'100vh': '100vh',
			},
			margin: {
				'18': '4.5rem',
				'75': '18.75rem',
				'1vh': '1vh',
				'1.25vh': '1.25vh',
				'1.5vh': '1.5vh',
				'1.75vh': '1.75vh',
				'2vh': '2vh',
				'2.5vh': '2.5vh',
				'3vh': '3vh',
				'3.5vh': '3.5vh',
				'4vh': '4vh',
				'4.5vh': '4.5vh',
				'5vh': '5vh',
				'6vh': '6vh',
				'7vh': '7vh',
				'8vh': '8vh',
				'9vh': '9vh',
				'10vh': '10vh',
				'11vh': '11vh',
				'12vh': '12vh',
				'13vh': '13vh',
				'14vh': '14vh',
				'15vh': '15vh',
				'16vh': '16vh',
				'17vh': '17vh',
				'18vh': '18vh',
				'19vh': '19vh',
				'20vh': '20vh',
				'25vh': '25vh',
				'30vh': '30vh',
				'35vh': '35vh',
				'40vh': '40vh',
				'45vh': '45vh',
				'50vh': '50vh',
				'55vh': '55vh',
				'60vh': '60vh',
				'65vh': '65vh',
				'70vh': '70vh',
				'75vh': '75vh',
				'80vh': '80vh',
				'85vh': '85vh',
				'90vh': '90vh',
				'95vh': '95vh',
				'100vh': '100vh',
			},
			gap: {
				'1/2': '50%',
				'1/3': '33.333333%',
				'2/3': '66.666667%',
				'1/4': '25%',
				'2/4': '50%',
				'3/4': '75%',
				'1/5': '20%',
				'2/5': '40%',
				'3/5': '60%',
				'4/5': '80%',
				'1/6': '16.666667%',
				'2/6': '33.333333%',
				'3/6': '50%',
				'4/6': '66.666667%',
				'5/6': '83.333333%',
				'1/12': '8.333333%',
				'2/12': '16.666667%',
				'3/12': '25%',
				'4/12': '33.333333%',
			}
		},
	},
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
