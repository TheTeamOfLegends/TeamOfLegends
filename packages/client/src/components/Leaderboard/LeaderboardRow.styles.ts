export const getRowStyles = (isCurrentUser?: boolean) =>
  ({
    minH: '72px',
    align: 'center',
    borderBottom: '1px solid',
    borderColor: 'whiteAlpha.200',
    bg: isCurrentUser ? 'rgba(235, 75, 118, 0.2)' : 'transparent',
  } as const)

export const placeColStyles = {
  w: '72px',
  textAlign: 'center',
} as const
