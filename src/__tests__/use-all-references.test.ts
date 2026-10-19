import { renderHook, waitFor } from '@testing-library/react-native'
import { createWrapper } from './__mocks__/react-query-wrapper'

jest.mock('../services/list', () => ({
  getAllDistinctReferences: jest.fn(),
  getDistinctReferences: jest.fn(),
  getTransactionsByReferences: jest.fn(),
}))
jest.mock('../context/auth', () => ({ useAuth: jest.fn() }))

import { useAuth } from '../context/auth'
import { getAllDistinctReferences } from '../services/list'
import { useAllReferences } from '../hooks/use-all-references'

const mockUseAuth = useAuth as jest.Mock
const mockGetAllDistinctReferences = getAllDistinctReferences as jest.Mock

beforeEach(() => { jest.clearAllMocks() })

describe('useAllReferences', () => {
  it('retorna array vazio quando não há sessão', () => {
    mockUseAuth.mockReturnValue({ session: null })
    const { result } = renderHook(() => useAllReferences(), { wrapper: createWrapper() })
    expect(result.current.references).toEqual([])
    expect(mockGetAllDistinctReferences).not.toHaveBeenCalled()
  })

  it('busca referências quando há sessão', async () => {
    mockUseAuth.mockReturnValue({ session: { user: { id: 'user-123' } } })
    mockGetAllDistinctReferences.mockResolvedValue(['2024-1', '2024-2', '2024-3'])
    const { result } = renderHook(() => useAllReferences(), { wrapper: createWrapper() })
    await waitFor(() => expect(result.current.references).toHaveLength(3))
    expect(mockGetAllDistinctReferences).toHaveBeenCalledWith('user-123')
  })
})
