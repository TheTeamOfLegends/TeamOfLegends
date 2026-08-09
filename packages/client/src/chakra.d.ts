import '@chakra-ui/react'
import {
  ToasterProps as OriginalToasterProps,
  SystemProperties,
  createToast,
} from '@chakra-ui/react'

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

  export interface ToasterProps extends Omit<OriginalToasterProps, 'children'> {
    toaster: ReturnType<typeof createToast>
    insetInline: SystemProperties['insetInline']
    children?: (toast: ReturnType<typeof createToast>) => React.ReactNode
  }

  export interface ToastTitleProps {
    children?: React.ReactNode
  }

  export interface ToastDescriptionProps {
    children?: React.ReactNode
  }

  export interface ToastActionTriggerProps {
    children?: React.ReactNode
  }
}

declare module 'react-icons' {
  export type IconType = (props: IconBaseProps) => React.ReactElement | null
}
