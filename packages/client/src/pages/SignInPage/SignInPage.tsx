import * as authApi from '@/api/authApi'
import { SignInFormValues, signInSchema } from '@/utils/zod/validationSchema'
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
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { LuEye, LuEyeOff } from 'react-icons/lu'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { toaster } from '../../components/ui/toaster'
import { useProfileStore } from '@/stores/profileStore'
import { oauthGetClientId, oauthRedirect } from '@/api/oauthApi'

const DEFAULT_VALUES: SignInFormValues = {
  login: '',
  password: '',
}

export const SignInPage: React.FC = () => {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const loadProfile = useProfileStore(s => s.loadProfile)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    mode: 'onBlur',
    defaultValues: DEFAULT_VALUES,
  })

  const onSubmit = async (data: SignInFormValues) => {
    try {
      await authApi.signIn(data)
      await loadProfile()

      navigate('/')
    } catch (error: unknown) {
      if (error instanceof Error) {
        toaster.create({
          description: error.message,
          type: 'error',
        })
      }
    }
  }

  const onOAuthClick = async () => {
    try {
      const clientId = await oauthGetClientId()
      oauthRedirect(clientId)
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

            <Button
              type="submit"
              colorPalette="blue"
              width="full"
              loading={isSubmitting}
              mt={2}>
              Войти
            </Button>

            <Flex
              width={'100%'}
              alignItems={'center'}
              _before={{
                content: '""',
                marginLeft: '6',
                flexGrow: 1,
                height: '2px',
                backgroundColor: 'gray.300',
              }}
              _after={{
                content: '""',
                marginRight: '6',
                flexGrow: 1,
                height: '2px',
                backgroundColor: 'gray.300',
              }}>
              <Box color={'gray.600'} marginInline={6}>
                или
              </Box>
            </Flex>

            <Button
              onClick={onOAuthClick}
              type="button"
              colorPalette="black"
              width="full"
              mt={2}
              display={'flex'}
              alignItems={'center'}
              columnGap={3}>
              <img
                src="/Yandex_icon.svg"
                alt="Иконка Яндекс"
                width="20"
                height="20"
              />
              <span>Войти с Яндекс ID</span>
            </Button>

            <Link colorPalette="blue" asChild>
              <RouterLink to="/sign-up">
                У вас нет аккаунта? Зарегистрироваться
              </RouterLink>
            </Link>
          </VStack>
        </form>
      </Box>
    </Flex>
  )
}
