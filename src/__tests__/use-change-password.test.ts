import { renderHook, act } from '@testing-library/react-native'

jest.mock('../services/auth', () => ({
  changePassword: jest.fn(),
  login: jest.fn(),
  signup: jest.fn(),
  logout: jest.fn(),
  requestPasswordReset: jest.fn(),
  resetPassword: jest.fn(),
}))
jest.mock('../context/auth', () => ({ useAuth: jest.fn() }))
jest.mock('../context/toast', () => ({ useToast: jest.fn() }))
jest.mock('react-intl', () => ({ useIntl: () => ({ formatMessage: ({ id }: { id: string }) => id }) }))

import { useAuth } from '../context/auth'
import { useToast } from '../context/toast'
import { changePassword } from '../services/auth'
import { useChangePassword } from '../hooks/use-change-password'

const mockUseAuth = useAuth as jest.Mock
const mockUseToast = useToast as jest.Mock
const mockChangePassword = changePassword as jest.Mock
const mockShowToast = jest.fn()

beforeEach(() => {
  jest.clearAllMocks()
  mockUseAuth.mockReturnValue({ session: { user: { email: 'nil@test.com' } } })
  mockUseToast.mockReturnValue({ showToast: mockShowToast })
})

describe('useChangePassword', () => {
  it('retorna isLoading=false e error=null inicialmente', () => {
    const { result } = renderHook(() => useChangePassword())
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it('retorna true e mostra toast de sucesso quando troca senha com sucesso', async () => {
    mockChangePassword.mockResolvedValue({ error: null })
    const { result } = renderHook(() => useChangePassword())
    let success: boolean
    await act(async () => { success = await result.current.submitChangePassword('senhaAtual', 'novaSenha') })
    expect(success!).toBe(true)
    expect(mockChangePassword).toHaveBeenCalledWith('nil@test.com', 'senhaAtual', 'novaSenha')
    expect(mockShowToast).toHaveBeenCalledWith('toast.password.changed')
  })

  it('retorna false e mostra toast de erro quando há erro', async () => {
    mockChangePassword.mockResolvedValue({ error: 'Senha incorreta' })
    const { result } = renderHook(() => useChangePassword())
    let success: boolean
    await act(async () => { success = await result.current.submitChangePassword('senhaErrada', 'novaSenha') })
    expect(success!).toBe(false)
    expect(result.current.error).toBe('Senha incorreta')
    expect(mockShowToast).toHaveBeenCalledWith('toast.error', 'error')
  })

  it('clearError limpa o estado de erro', async () => {
    mockChangePassword.mockResolvedValue({ error: 'Senha incorreta' })
    const { result } = renderHook(() => useChangePassword())
    await act(async () => { await result.current.submitChangePassword('senhaErrada', 'novaSenha') })
    act(() => { result.current.clearError() })
    expect(result.current.error).toBeNull()
  })
})
