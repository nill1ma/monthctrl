import { renderHook, act, waitFor } from '@testing-library/react-native'
import { createWrapper } from './__mocks__/react-query-wrapper'

jest.mock('../services/profiles', () => ({ getMyProfile: jest.fn(), updateMyProfile: jest.fn() }))
jest.mock('../context/auth', () => ({ useAuth: jest.fn() }))
jest.mock('../context/toast', () => ({ useToast: jest.fn() }))
jest.mock('react-intl', () => ({ useIntl: () => ({ formatMessage: ({ id }: { id: string }) => id }) }))

import { getMyProfile, updateMyProfile } from '../services/profiles'
import { useAuth } from '../context/auth'
import { useToast } from '../context/toast'
import { useProfile } from '../hooks/use-profile'

const mockGetMyProfile = getMyProfile as jest.Mock
const mockUpdateMyProfile = updateMyProfile as jest.Mock
const mockUseAuth = useAuth as jest.Mock
const mockUseToast = useToast as jest.Mock

describe('useProfile', () => {
  const mockShowToast = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    mockUseAuth.mockReturnValue({ session: { user: { id: 'user-123' } } })
    mockUseToast.mockReturnValue({ showToast: mockShowToast })
    mockGetMyProfile.mockResolvedValue({ name: 'Nilton' })
    mockUpdateMyProfile.mockResolvedValue(undefined)
  })

  it('retorna profile após query', async () => {
    const { result } = renderHook(() => useProfile(), { wrapper: createWrapper() })
    await waitFor(() => expect(result.current.isProfileLoading).toBe(false))
    expect(result.current.profile).toEqual({ name: 'Nilton' })
  })

  it('query desativada sem session', async () => {
    mockUseAuth.mockReturnValue({ session: null })
    const { result } = renderHook(() => useProfile(), { wrapper: createWrapper() })
    await waitFor(() => expect(result.current.isProfileLoading).toBe(false))
    expect(mockGetMyProfile).not.toHaveBeenCalled()
  })

  it('saveProfile chama updateMyProfile e mostra toast de sucesso', async () => {
    const { result } = renderHook(() => useProfile(), { wrapper: createWrapper() })
    await act(async () => { await result.current.saveProfile({ name: 'Nilton' } as any) })
    expect(mockUpdateMyProfile).toHaveBeenCalled()
    const callArg = mockUpdateMyProfile.mock.calls[0][0]
    expect(callArg).toEqual({ name: 'Nilton' })
    expect(mockShowToast).toHaveBeenCalledWith('toast.profile.updated')
  })

  it('saveProfile mostra toast de erro quando falha', async () => {
    mockUpdateMyProfile.mockRejectedValue(new Error('falha'))
    const { result } = renderHook(() => useProfile(), { wrapper: createWrapper() })
    await act(async () => {
      await result.current.saveProfile({ name: 'Nilton' } as any).catch(() => {})
    })
    expect(mockShowToast).toHaveBeenCalledWith('toast.error', 'error')
  })
})
