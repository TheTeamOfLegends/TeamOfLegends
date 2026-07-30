import * as authApi from '@/api/authApi'
import { VALIDATION_MESSAGES } from '@/dictionary'
import { renderWithProviders } from '@/jest.setup'
import { act, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SignInPage } from './SignInPage'

jest.mock('@/api/authApi')

const mockedAuthApi = jest.mocked(authApi)

describe('SignInPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('показывает ошибки валидации при blur на пустые поля', async () => {
    const user = userEvent.setup()
    renderWithProviders(<SignInPage />)

    const loginInput = screen.getByLabelText('Логин') as HTMLInputElement

    user.type(loginInput, 'BMO')
    user.clear(loginInput)
    user.click(loginInput)
    user.click(document.body)

    await waitFor(() => {
      expect(screen.getByText(VALIDATION_MESSAGES.REQUIRED_INPUT)).toBeDefined()
    })
  })

  it('не отправляет форму если валидация не пройдена', async () => {
    renderWithProviders(<SignInPage />)

    const submitButton = screen.getByText('Войти')

    userEvent.click(submitButton)

    await waitFor(() => {
      expect(mockedAuthApi.signIn).not.toHaveBeenCalled()
    })
  })

  it('вызывает authApi.signIn при корректной отправке формы', async () => {
    mockedAuthApi.signIn.mockResolvedValueOnce(undefined)
    renderWithProviders(<SignInPage />)

    const loginInput = screen.getByLabelText('Логин') as HTMLInputElement
    const passwordInput = screen.getByLabelText('Пароль') as HTMLInputElement

    await userEvent.type(loginInput, 'Gunter')
    await userEvent.type(passwordInput, 'Q123456789')

    const submitButton = screen.getByText('Войти')

    userEvent.click(submitButton)

    await waitFor(() => {
      expect(mockedAuthApi.signIn).toHaveBeenCalledWith({
        login: 'Gunter',
        password: 'Q123456789',
      })
    })
  })

  it('переключает видимость пароля', async () => {
    renderWithProviders(<SignInPage />)

    const passwordInput = screen.getByLabelText('Пароль') as HTMLInputElement
    const toggleButton = screen.getByLabelText('Показать пароль')

    expect(passwordInput.type).toBe('password')

    await act(async () => await userEvent.click(toggleButton))
    expect(passwordInput.type).toBe('text')

    await act(async () => await userEvent.click(toggleButton))
    expect(passwordInput.type).toBe('password')
  })
})
