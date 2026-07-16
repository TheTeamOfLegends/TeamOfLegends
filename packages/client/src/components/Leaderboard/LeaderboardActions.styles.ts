export const actionsStyles = {
  gap: 4,
  justify: 'center',
  flexDir: { base: 'column', sm: 'row' },
  align: 'center',
} as const

export const actionButtonStyles = {
  flex: 1,
  w: 'full',
  maxW: '280px',
  h: '56px',
  fontSize: '18px',
} as const

export const cancelButtonStyles = {
  ...actionButtonStyles,
  bg: 'transparent',
  border: '1px solid',
  borderColor: 'white',
  color: 'white',
  _hover: { bg: 'whiteAlpha.200' },
  _active: { bg: 'whiteAlpha.300' },
} as const
