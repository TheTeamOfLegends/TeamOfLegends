import * as authApi from '@/api/authApi'
import { SignUpFormValues, signUpSchema } from '@/utils/zod/validationSchema'
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

const DEFAULT_VALUES: SignUpFormValues = {
  first_name: '',
  second_name: '',
  login: '',
  email: '',
  password: '',
  phone: '',
}

export const SignUpPage: React.FC = () => {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const loadProfile = useProfileStore(s => s.loadProfile)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    mode: 'onBlur',
    defaultValues: DEFAULT_VALUES,
  })

  const onSubmit = async (data: SignUpFormValues) => {
    try {
      await authApi.signUp(data)
      await loadProfile()

      toaster.create({
        description: 'Вы успешно зарегистрировались',
        type: 'success',
      })

      navigate('/game')
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
    <Flex minH="100vh" align="center" justify="center" bg="bg.muted" py={10}>
      <Box
        p={8}
        maxWidth="450px"
        borderWidth={1}
        borderRadius="lg"
        boxShadow="md"
        bg="bg.panel"
        w="full"
        mx={4}>
        <Box textAlign="center" mb={6}>
          <Heading size="xl">Регистрация</Heading>
        </Box>

        <form onSubmit={handleSubmit(onSubmit)}>
          <VStack spaceY={4}>
            <Field.Root invalid={!!errors.first_name}>
              <Field.Label>Имя</Field.Label>
              <Input {...register('first_name')} />
              {errors.first_name?.message && (
                <Field.ErrorText>{errors.first_name.message}</Field.ErrorText>
              )}
            </Field.Root>

            <Field.Root invalid={!!errors.second_name}>
              <Field.Label>Фамилия</Field.Label>
              <Input {...register('second_name')} />
              {errors.second_name?.message && (
                <Field.ErrorText>{errors.second_name.message}</Field.ErrorText>
              )}
            </Field.Root>

            <Field.Root invalid={!!errors.login}>
              <Field.Label>Логин</Field.Label>
              <Input {...register('login')} />
              {errors.login?.message && (
                <Field.ErrorText>{errors.login.message}</Field.ErrorText>
              )}
            </Field.Root>

            <Field.Root invalid={!!errors.email}>
              <Field.Label>Почта</Field.Label>
              <Input {...register('email')} />
              {errors.email?.message && (
                <Field.ErrorText>{errors.email.message}</Field.ErrorText>
              )}
            </Field.Root>

            <Field.Root invalid={!!errors.phone}>
              <Field.Label>Телефон</Field.Label>
              <Input type="tel" {...register('phone')} />
              {errors.phone?.message && (
                <Field.ErrorText>{errors.phone.message}</Field.ErrorText>
              )}
            </Field.Root>

            <Field.Root invalid={!!errors.password}>
              <Field.Label>Пароль</Field.Label>
              <InputGroup
                w="full"
                endElement={
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPassword(!showPassword)}
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
              {errors.password?.message && (
                <Field.ErrorText>{errors.password.message}</Field.ErrorText>
              )}
            </Field.Root>

            <Link colorPalette="blue" asChild>
              <RouterLink to="/sign-in">Уже есть аккаунт? Войти</RouterLink>
            </Link>

            <Button
              type="submit"
              colorPalette="blue"
              width="full"
              loading={isSubmitting}
              mt={2}>
              Зарегистрироваться
            </Button>
          </VStack>
        </form>
      </Box>
    </Flex>
  )
}
