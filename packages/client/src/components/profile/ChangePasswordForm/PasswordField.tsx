import { Button, Field, HStack, Input, InputGroup } from '@chakra-ui/react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { LuEye, LuEyeOff } from 'react-icons/lu'
import { DEFAULT_VALUES } from './ChangePasswordForm'

type PasswordFieldProps = {
  label: string
  name: keyof typeof DEFAULT_VALUES
  register: ReturnType<typeof useForm<typeof DEFAULT_VALUES>>['register']
  error?: string
  withBorder?: boolean
  rules?: object
}

export const PasswordField = ({
  label,
  name,
  register,
  error,
  withBorder = true,
  rules,
}: PasswordFieldProps) => {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <Field.Root invalid={!!error}>
      <HStack
        w="100%"
        justify="space-between"
        align="center"
        py={2}
        borderBottomWidth={withBorder ? 1 : 0}>
        <Field.Label fontWeight="bold" flexShrink={0}>
          {label}
        </Field.Label>

        <InputGroup
          w="full"
          color="fg.subtle"
          endElementProps={{ px: 0 }}
          endElement={
            <Button
              variant="ghost"
              size="xs"
              color="fg.subtle"
              onClick={() => setShowPassword(prev => !prev)}
              aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}>
              {showPassword ? <LuEyeOff /> : <LuEye />}
            </Button>
          }>
          <Input
            {...register(name, rules)}
            type={showPassword ? 'text' : 'password'}
            border={0}
            h="20px"
            flex={1}
            textAlign="right"
          />
        </InputGroup>
      </HStack>

      <Field.ErrorText>{error}</Field.ErrorText>
    </Field.Root>
  )
}
