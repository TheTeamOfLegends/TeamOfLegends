import '@chakra-ui/react'

declare module '@chakra-ui/react' {
  export interface FieldLabelProps {
    children?: React.ReactNode
  }

  export interface FieldErrorTextProps {
    children?: React.ReactNode
  }

  export interface FieldHelperTextProps {
    children?: React.ReactNode
  }

  export interface FieldRootProps {
    children?: React.ReactNode
  }
}
