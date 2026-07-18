export const pageShellStyles = {
  minH: '100vh',
  display: 'flex',
  flexDir: 'column',
} as const

export const pageContentStyles = {
  direction: 'column',
  flex: 1,
  align: 'center',
  justify: 'center',
  px: 4,
  py: 8,
  pb: 10,
  backgroundImage: "url('/hero-bg.png')",
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
} as const
