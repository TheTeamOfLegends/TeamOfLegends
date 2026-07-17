import {
  Box,
  Button,
  Field,
  Flex,
  Heading,
  Input,
  InputGroup,
  Link,
  VStack,
} from '@chakra-ui/react'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { LuEye, LuEyeOff } from 'react-icons/lu'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { toaster } from '../../components/ui/toaster'
import { API_BASE_URL } from '../../constants'
import { ERROR_MESSAGES } from '../../dictionary'

const DEFAULT_VALUES = {
  login: '',
  password: '',
}

export const SignInPage: React.FC = () => {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<typeof DEFAULT_VALUES>({
    defaultValues: DEFAULT_VALUES,
  })

  const onSubmit = async (data: typeof DEFAULT_VALUES) => {
    try {
      const response = await fetch(`${API_BASE_URL}/v2/auth/signin`, {
        credentials: 'include',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        navigate('/game')
      } else {
        const responseBody = await response.json()

        throw new Error(responseBody.reason ?? ERROR_MESSAGES.REQUEST_FAILED)
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        toaster.create({
          description: error.message,
          type: 'error',
        })
      }
    }
  }

  return (
    <Flex minH="100vh" align="center" justify="center" bg="bg.muted">
      <Box
        p={8}
        maxWidth="400px"
        borderWidth={1}
        borderRadius="lg"
        boxShadow="md"
        bg="bg.panel"
        w="full">
        <Box textAlign="center" mb={6}>
          <Heading size="xl">Вход</Heading>
        </Box>

        <form onSubmit={handleSubmit(onSubmit)}>
          <VStack spaceY={4}>
            <Field.Root invalid={!!errors.login}>
              <Field.Label>Логин</Field.Label>
              <Input {...register('login')} />
              <Field.ErrorText>{errors.login?.message}</Field.ErrorText>
            </Field.Root>

            <Field.Root invalid={!!errors.password}>
              <Field.Label>Пароль</Field.Label>
              <InputGroup
                w="full"
                endElement={
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPassword(prev => !prev)}
                    aria-label={
                      showPassword ? 'Скрыть пароль' : 'Показать пароль'
                    }>
                    {showPassword ? <LuEyeOff /> : <LuEye />}
                  </Button>
                }>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')}
                />
              </InputGroup>
              <Field.ErrorText>{errors.password?.message}</Field.ErrorText>
            </Field.Root>

            <Link colorPalette="blue" asChild>
              <RouterLink to="/sign-up">
                У вас нет аккаунта? Зарегистрироваться
              </RouterLink>
            </Link>

            <Button
              type="submit"
              colorPalette="blue"
              width="full"
              loading={isSubmitting}
              mt={2}>
              Войти
            </Button>
          </VStack>
        </form>
      </Box>
    </Flex>
  )
}
