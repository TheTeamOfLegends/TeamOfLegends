import * as authApi from '@/api/authApi'
import { act, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SignUpPage } from './SignUpPage'
import { renderWithProviders } from '@/jest.setup'

jest.mock('@/api/authApi')

const mockedAuthApi = jest.mocked(authApi)

describe('SignUpPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('не отправляет форму если валидация не пройдена', async () => {
    renderWithProviders(<SignUpPage />)

    const submitButton = screen.getByText('Зарегистрироваться')
    userEvent.click(submitButton)

    await waitFor(() => {
      expect(mockedAuthApi.signIn).not.toHaveBeenCalled()
    })
  })

  it('вызывает authApi.signUp при корректной отправке формы', async () => {
    mockedAuthApi.signUp.mockResolvedValueOnce(undefined)
    renderWithProviders(<SignUpPage />)

    const inputs = {
      first_name: screen.getByLabelText('Имя'),
      second_name: screen.getByLabelText('Фамилия'),
      login: screen.getByLabelText('Логин'),
      email: screen.getByLabelText('Почта'),
      phone: screen.getByLabelText('Телефон'),
      password: screen.getByLabelText('Пароль'),
    }

    await userEvent.type(inputs.first_name, 'Володя')
    await userEvent.type(inputs.second_name, 'Трубы')
    await userEvent.type(inputs.login, 'Zepp')
    await userEvent.type(inputs.email, 'zepp@ya.ru')
    await userEvent.type(inputs.phone, '+70987654321')
    await userEvent.type(inputs.password, 'Q123456789')

    userEvent.click(screen.getByText('Зарегистрироваться'))

    await waitFor(() => {
      expect(mockedAuthApi.signUp).toHaveBeenCalledWith({
        first_name: 'Володя',
        second_name: 'Трубы',
        login: 'Zepp',
        email: 'zepp@ya.ru',
        phone: '+70987654321',
        password: 'Q123456789',
      })
    })
  })

  it('переключает видимость пароля', async () => {
    renderWithProviders(<SignUpPage />)

    const passwordInput = screen.getByLabelText('Пароль') as HTMLInputElement
    const toggleButton = screen.getByLabelText('Показать пароль')

    expect(passwordInput.type).toBe('password')

    await act(async () => await userEvent.click(toggleButton))
    expect(passwordInput.type).toBe('text')

    await act(async () => await userEvent.click(toggleButton))
    expect(passwordInput.type).toBe('password')
  })
})
