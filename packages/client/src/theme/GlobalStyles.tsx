import { Global, css } from '@emotion/react'
import OrbitronWoff2 from '@/assets/fonts/Orbitron.woff2'
import OrbitronWoff from '@/assets/fonts/Orbitron.woff'

export const GlobalStyles = () => (
  <Global
    styles={css`
      @font-face {
        font-family: 'Orbitron';
        src: url(${OrbitronWoff2}) format('woff2'),
          url(${OrbitronWoff}) format('woff');
        font-weight: 700;
        font-style: normal;
        font-display: swap;
      }
    `}
  />
)
