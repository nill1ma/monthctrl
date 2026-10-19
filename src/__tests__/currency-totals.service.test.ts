import './__mocks__/db-queries'
import { mockCurrencyTotalsQueries } from './__mocks__/db-queries'
import { getCurrenciesInRange, getCurrencyTotals } from '../services/currency-totals'

beforeEach(() => { jest.clearAllMocks() })

describe('getCurrencyTotals', () => {
  it('delega para a query passando o userId', async () => {
    const mockData = [{ currency: 'BRL', incoming_value: 5000, expense_value: 3000, net_income: 2000 }]
    mockCurrencyTotalsQueries.getCurrencyTotals.mockReturnValue(mockData)
    const result = await getCurrencyTotals('user-123')
    expect(mockCurrencyTotalsQueries.getCurrencyTotals).toHaveBeenCalledWith('user-123')
    expect(result).toEqual(mockData)
  })

  it('retorna array vazio quando não há totais', async () => {
    mockCurrencyTotalsQueries.getCurrencyTotals.mockReturnValue([])
    const result = await getCurrencyTotals('user-123')
    expect(result).toEqual([])
  })
})

describe('getCurrenciesInRange', () => {
  it('delega para a query passando userId, start e end', async () => {
    mockCurrencyTotalsQueries.getCurrenciesInRange.mockReturnValue(['BRL', 'USD'])
    const result = await getCurrenciesInRange('user-123', '2024-1', '2024-6')
    expect(mockCurrencyTotalsQueries.getCurrenciesInRange).toHaveBeenCalledWith('user-123', '2024-1', '2024-6')
    expect(result).toEqual(['BRL', 'USD'])
  })

  it('retorna array vazio quando não há moedas no período', async () => {
    mockCurrencyTotalsQueries.getCurrenciesInRange.mockReturnValue([])
    const result = await getCurrenciesInRange('user-123', '2024-1', '2024-6')
    expect(result).toEqual([])
  })
})
