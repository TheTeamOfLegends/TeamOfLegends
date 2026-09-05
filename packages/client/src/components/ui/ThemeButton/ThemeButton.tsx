import { useContext } from 'react'
import { IconButton, IconButtonProps } from '@chakra-ui/react'
import MoonButton from '../../../assets/icons/moon.svg?react'
import { ThemeContext } from '../../../theme/ThemeContext'

export const ThemeButton = (props: IconButtonProps) => {
  const { theme, changeTheme } = useContext(ThemeContext)

  const isLight = theme === 'light'

  return (
    <IconButton
      onClick={() => changeTheme(isLight ? 'dark' : 'light')}
      {...props}
      aria-label="Сменить тему"
      variant="ghost"
      color={isLight ? 'black' : 'white'}
      bg={isLight ? 'white' : 'transparent'}
      borderRadius="full"
      outline="none"
      boxShadow="none"
      _hover={{
        bg: isLight ? 'whiteAlpha.800' : 'whiteAlpha.200',
      }}>
      <MoonButton
        style={{
          filter: isLight ? 'none' : 'invert(1)',
        }}
      />
    </IconButton>
  )
}
