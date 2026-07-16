export const panelStyles = {
  w: 'full',
  maxW: '900px',
  bg: 'rgba(8, 11, 44, 0.85)',
  backdropFilter: 'blur(12px)',
  border: '1px solid',
  borderColor: 'whiteAlpha.200',
  borderRadius: '2xl',
  px: { base: 4, md: 10 },
  py: 8,
} as const

export const titleStyles = {
  textAlign: 'center',
  fontFamily: 'Orbitron',
  fontWeight: '700',
  fontSize: { base: '28px', md: '40px' },
  letterSpacing: '0.08em',
  lineHeight: 1,
  textTransform: 'uppercase',
  color: 'white',
  userSelect: 'none',
  mb: 6,
} as const
