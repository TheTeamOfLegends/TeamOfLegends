export const ACCENT = '#EB4B76'

export const tableWrapperStyles = {
  border: '1px solid',
  borderColor: 'whiteAlpha.300',
  borderRadius: '10px',
  overflow: 'hidden',
  position: 'relative',
  mb: 8,
  maxH: '420px',
  _after: {
    content: '""',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '56px',
    bg: 'linear-gradient(transparent, rgba(8, 11, 44, 0.95))',
    pointerEvents: 'none',
    zIndex: 1,
  },
} as const

export const tableScrollStyles = {
  overflowY: 'auto',
  maxH: '420px',
  css: {
    '&::-webkit-scrollbar': { width: '6px' },
    '&::-webkit-scrollbar-track': {
      background: 'rgba(255, 255, 255, 0.06)',
      borderRadius: '8px',
    },
    '&::-webkit-scrollbar-thumb': {
      background: ACCENT,
      borderRadius: '8px',
    },
    '&::-webkit-scrollbar-thumb:hover': {
      background: '#d93f68',
    },
    scrollbarWidth: 'thin',
    scrollbarColor: `${ACCENT} rgba(255, 255, 255, 0.06)`,
  },
} as const

export const tableHeaderStyles = {
  borderBottom: '1px solid',
  borderColor: 'whiteAlpha.300',
  color: 'whiteAlpha.700',
  fontWeight: 'bold',
  fontSize: 'sm',
  position: 'sticky',
  top: 0,
  bg: 'rgba(8, 11, 44, 0.95)',
  zIndex: 2,
} as const

export const placeColStyles = {
  w: '72px',
  textAlign: 'center',
} as const
