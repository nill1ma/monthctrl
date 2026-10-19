import { renderHook, waitFor } from '@testing-library/react-native'
import { createWrapper } from './__mocks__/react-query-wrapper'

jest.mock('../services/exchange-rates', () => ({ fetchExchangeRates: jest.fn() }))

import { fetchExchangeRates } from '../services/exchange-rates'
import { useExchangeRates } from '../hooks/use-exchange-rates'

const mockFetchExchangeRates = fetchExchangeRates as jest.Mock

beforeEach(() => { jest.clearAllMocks() })

describe('useExchangeRates', () => {
  it('não executa query quando targets está vazio', () => {
    const { result } = renderHook(() => useExchangeRates('BRL', []), { wrapper: createWrapper() })
    expect(result.current.fetchStatus).toBe('idle')
    expect(mockFetchExchangeRates).not.toHaveBeenCalled()
  })

  it('busca taxas quando targets tem moedas', async () => {
    mockFetchExchangeRates.mockResolvedValue({ USD: 0.2, EUR: 0.18 })
    const { result } = renderHook(() => useExchangeRates('BRL', ['USD', 'EUR']), { wrapper: createWrapper() })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(mockFetchExchangeRates).toHaveBeenCalledWith('BRL', ['EUR', 'USD'])
    expect(result.current.data).toEqual({ USD: 0.2, EUR: 0.18 })
  })

  it('ordena os targets antes de montar a queryKey', async () => {
    mockFetchExchangeRates.mockResolvedValue({})
    const { result } = renderHook(() => useExchangeRates('BRL', ['USD', 'EUR', 'GBP']), { wrapper: createWrapper() })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(mockFetchExchangeRates).toHaveBeenCalledWith('BRL', ['EUR', 'GBP', 'USD'])
  })
})
