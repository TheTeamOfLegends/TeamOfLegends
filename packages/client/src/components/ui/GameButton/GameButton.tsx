import { Button, type ButtonProps } from '@chakra-ui/react'

export const GameButton = (props: ButtonProps) => (
  <Button
    borderRadius="6px"
    fontSize="16px"
    bg="#EB4B76"
    color="white"
    _hover={{
      bg: '#d93f68',
    }}
    _active={{
      bg: '#c3355b',
    }}
    {...props}
  />
)
