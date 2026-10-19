import { renderHook, waitFor } from '@testing-library/react-native'
import { createWrapper } from './__mocks__/react-query-wrapper'

jest.mock('../services/currency-totals', () => ({
  getCurrenciesInRange: jest.fn(),
  getCurrencyTotals: jest.fn(),
}))
jest.mock('../context/auth', () => ({ useAuth: jest.fn() }))

import { useAuth } from '../context/auth'
import { getCurrenciesInRange } from '../services/currency-totals'
import { useAvailableCurrencies } from '../hooks/use-available-currencies'

const mockUseAuth = useAuth as jest.Mock
const mockGetCurrenciesInRange = getCurrenciesInRange as jest.Mock

beforeEach(() => { jest.clearAllMocks() })

describe('useAvailableCurrencies', () => {
  it('retorna array vazio quando não há sessão', () => {
    mockUseAuth.mockReturnValue({ session: null })
    const { result } = renderHook(() => useAvailableCurrencies('2024-1', '2024-6'), { wrapper: createWrapper() })
    expect(result.current.currencies).toEqual([])
    expect(mockGetCurrenciesInRange).not.toHaveBeenCalled()
  })

  it('busca moedas no período quando há sessão', async () => {
    mockUseAuth.mockReturnValue({ session: { user: { id: 'user-123' } } })
    mockGetCurrenciesInRange.mockResolvedValue(['BRL', 'USD'])
    const { result } = renderHook(() => useAvailableCurrencies('2024-1', '2024-6'), { wrapper: createWrapper() })
    await waitFor(() => expect(result.current.currencies).toHaveLength(2))
    expect(mockGetCurrenciesInRange).toHaveBeenCalledWith('user-123', '2024-1', '2024-6')
  })

  it('não executa quando referenceStart está vazio', () => {
    mockUseAuth.mockReturnValue({ session: { user: { id: 'user-123' } } })
    const { result } = renderHook(() => useAvailableCurrencies('', '2024-6'), { wrapper: createWrapper() })
    expect(result.current.currencies).toEqual([])
    expect(mockGetCurrenciesInRange).not.toHaveBeenCalled()
  })
})
