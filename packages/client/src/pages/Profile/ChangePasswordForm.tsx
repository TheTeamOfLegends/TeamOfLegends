import { Button, Stack, VStack } from '@chakra-ui/react'
import { useForm } from 'react-hook-form'
import { updatePassword } from '../../api/profileApi'
import { toaster } from '../../components/ui/toaster'
import { PasswordField } from './PasswordField'

export const DEFAULT_VALUES = {
  old_password: '',
  new_password: '',
  new_password_confirm: '',
}

export const ChangePasswordForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<typeof DEFAULT_VALUES>({
    defaultValues: DEFAULT_VALUES,
  })

  const onSubmit = async (data: typeof DEFAULT_VALUES) => {
    try {
      await updatePassword(data.old_password, data.new_password)
    } catch (error: unknown) {
      if (error instanceof Error) {
        toaster.create({
          description: error.message,
          type: 'error',
        })
      }
    } finally {
      reset()
    }
  }

  return (
    <Stack maxWidth="510px" w="full" fontSize="13px" color="fg.muted">
      <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%' }}>
        <VStack>
          <PasswordField
            label="Старый пароль"
            name="old_password"
            register={register}
            error={errors.old_password?.message}
          />

          <PasswordField
            label="Новый пароль"
            name="new_password"
            register={register}
            error={errors.new_password?.message}
          />

          <PasswordField
            label="Повторите новый пароль"
            name="new_password_confirm"
            register={register}
            error={errors.new_password_confirm?.message}
            withBorder={false}
          />
          <Button
            type="submit"
            colorPalette="blue"
            loading={isSubmitting}
            mt={6}>
            Сохранить
          </Button>
        </VStack>
      </form>
    </Stack>
  )
}
