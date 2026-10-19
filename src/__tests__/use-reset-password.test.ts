import { renderHook, act, waitFor } from '@testing-library/react-native'
import { createWrapper } from './__mocks__/react-query-wrapper'

jest.mock('../services/auth', () => ({
  resetPassword: jest.fn(),
  login: jest.fn(),
  signup: jest.fn(),
  logout: jest.fn(),
  changePassword: jest.fn(),
  requestPasswordReset: jest.fn(),
}))

import { resetPassword } from '../services/auth'
import { useResetPassword } from '../hooks/use-reset-password'

const mockResetPassword = resetPassword as jest.Mock

describe('useResetPassword', () => {
  beforeEach(() => jest.clearAllMocks())

  it('chama resetPassword com a nova senha', async () => {
    mockResetPassword.mockResolvedValue({})
    const { result } = renderHook(() => useResetPassword(), { wrapper: createWrapper() })
    await act(async () => { await result.current.resetPasswordMutate('novaSenha123') })
    expect(mockResetPassword).toHaveBeenCalledWith('novaSenha123')
  })

  it('isPending é true durante a execução', async () => {
    let resolve: () => void
    mockResetPassword.mockReturnValue(new Promise(r => { resolve = r }))
    const { result } = renderHook(() => useResetPassword(), { wrapper: createWrapper() })
    act(() => { result.current.resetPasswordMutate('senha') })
    await waitFor(() => expect(result.current.isPending).toBe(true))
    act(() => resolve!())
  })

  it('expõe error quando resetPassword rejeita', async () => {
    mockResetPassword.mockRejectedValue(new Error('token inválido'))
    const { result } = renderHook(() => useResetPassword(), { wrapper: createWrapper() })
    await act(async () => {
      await result.current.resetPasswordMutate('qualquerSenha').catch(() => {})
    })
    await waitFor(() => expect(result.current.error).toBeTruthy())
  })
})
