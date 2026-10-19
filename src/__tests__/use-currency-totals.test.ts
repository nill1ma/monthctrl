import { renderHook, waitFor } from '@testing-library/react-native'
import { createWrapper } from './__mocks__/react-query-wrapper'

jest.mock('../services/currency-totals', () => ({ getCurrencyTotals: jest.fn() }))
jest.mock('../context/auth', () => ({ useAuth: jest.fn() }))

import { useAuth } from '../context/auth'
import { getCurrencyTotals } from '../services/currency-totals'
import { useCurrencyTotals } from '../hooks/use-currency-totals'

const mockUseAuth = useAuth as jest.Mock
const mockGetCurrencyTotals = getCurrencyTotals as jest.Mock

beforeEach(() => { jest.clearAllMocks() })

describe('useCurrencyTotals', () => {
  it('não executa quando não há sessão', () => {
    mockUseAuth.mockReturnValue({ session: null })
    const { result } = renderHook(() => useCurrencyTotals(), { wrapper: createWrapper() })
    expect(result.current.fetchStatus).toBe('idle')
    expect(mockGetCurrencyTotals).not.toHaveBeenCalled()
  })

  it('busca totais quando há sessão', async () => {
    mockUseAuth.mockReturnValue({ session: { user: { id: 'user-123' } } })
    const mockData = [{ currency: 'BRL', incoming_value: 5000, expense_value: 3000, net_income: 2000 }]
    mockGetCurrencyTotals.mockResolvedValue(mockData)
    const { result } = renderHook(() => useCurrencyTotals(), { wrapper: createWrapper() })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(mockGetCurrencyTotals).toHaveBeenCalledWith('user-123')
    expect(result.current.data).toEqual(mockData)
  })
})
