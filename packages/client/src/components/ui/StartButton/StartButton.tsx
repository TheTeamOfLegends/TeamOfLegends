import { Button, type ButtonProps } from '@chakra-ui/react'

export const StartButton = (props: ButtonProps) => (
  <Button
    w="100px"
    h="100px"
    p={0}
    borderRadius="full"
    bg="#EB4B76"
    color="white"
    _hover={{
      bg: '#d93f68',
    }}
    _active={{
      bg: '#c3355b',
    }}
    {...props}>
    <svg
      width="18"
      height="20"
      viewBox="0 0 18 20"
      fill="currentColor"
      aria-hidden="true">
      <path d="M2 1.5L16 10L2 18.5V1.5Z" />
    </svg>
  </Button>
)
