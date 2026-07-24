import { VALIDATION_MESSAGES } from '@/dictionary'
import * as z from 'zod'

const {
  MAX_LENGTH: MAX_CHAR,
  MIN_LENGTH: MIN_CHAR,
  REQUIRED_INPUT,
} = VALIDATION_MESSAGES

const NAME_REGEX = /^[A-ZА-ЯЁ][a-zа-яё-]*$/u
const LOGIN_REGEX = /^(?!\d+$)[A-Za-z0-9\-_]+$/u
const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z]+(?:\.[A-Za-z]+)+$/u
const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*\d).+$/u
const PHONE_REGEX = /^\+?\d+$/u

const LOGIN_SCHEMA = z
  .string()
  .min(1, REQUIRED_INPUT)
  .min(3, MIN_CHAR(3))
  .max(20, MAX_CHAR(20))
  .regex(
    LOGIN_REGEX,
    'Латиница и цифры, допустимы дефис и нижнее подчеркивание'
  )

const PASSWORD_SCHEMA = z
  .string()
  .min(1, REQUIRED_INPUT)
  .min(8, MIN_CHAR(8))
  .max(40, MAX_CHAR(40))
  .regex(
    PASSWORD_REGEX,
    'Латиница. Пароль должен содержать заглавную букву и цифру'
  )

const NAME_SCHEMA = z
  .string()
  .min(1, REQUIRED_INPUT)
  .regex(
    NAME_REGEX,
    'Латиница или кириллица, с заглавной буквы, без цифр и пробелов (допустим дефис)'
  )

const EMAIL_SCHEMA = z
  .string()
  .min(1, REQUIRED_INPUT)
  .regex(EMAIL_REGEX, 'Латиница, может включать цифры и дефис')

const PHONE_SCHEMA = z
  .string()
  .min(1, REQUIRED_INPUT)
  .min(10, MIN_CHAR(10))
  .max(15, MAX_CHAR(15))
  .regex(PHONE_REGEX, 'Цифры, может начинаться с плюса')

export const signInSchema = z.object({
  login: LOGIN_SCHEMA,
  password: PASSWORD_SCHEMA,
})

export const signUpSchema = z.object({
  first_name: NAME_SCHEMA,
  second_name: NAME_SCHEMA,
  login: LOGIN_SCHEMA,
  email: EMAIL_SCHEMA,
  phone: PHONE_SCHEMA,
  password: PASSWORD_SCHEMA,
})

export const profileSchema = z.object({
  first_name: NAME_SCHEMA,
  second_name: NAME_SCHEMA,
  login: LOGIN_SCHEMA,
  email: EMAIL_SCHEMA,
  phone: PHONE_SCHEMA,
  newPassword: PASSWORD_SCHEMA,
  oldPassword: PASSWORD_SCHEMA,
  confirmPassword: PASSWORD_SCHEMA,
})

export type SignInFormValues = z.infer<typeof signInSchema>

export type SignUpFormValues = z.infer<typeof signUpSchema>

export type ProfileFormValues = z.infer<typeof profileSchema>
