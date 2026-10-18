import { groupTransactionsByReference, getConvertedBalance } from '../lib/transactions'

const makeTransaction = (overrides = {}) => ({
  reference: '2024-1',
  currency: 'BRL',
  incoming_value: 0,
  expense_value: 0,
  net_income: 0,
  ...overrides,
})

describe('groupTransactionsByReference', () => {
  it('retorna array vazio para input vazio', () => {
    expect(groupTransactionsByReference([])).toEqual([])
  })
  it('agrupa por reference', () => {
    const result = groupTransactionsByReference([
      makeTransaction({ reference: '2024-1', currency: 'BRL' }),
      makeTransaction({ reference: '2024-1', currency: 'USD' }),
      makeTransaction({ reference: '2024-2', currency: 'BRL' }),
    ])
    expect(result).toHaveLength(2)
    expect(result.find(r => r.reference === '2024-1')?.currencies).toHaveLength(2)
  })
  it('mantém todos os campos', () => {
    const result = groupTransactionsByReference([
      makeTransaction({ currency: 'BRL', incoming_value: 1000, expense_value: 300, net_income: 700 }),
    ])
    expect(result[0].currencies[0]).toEqual({ currency: 'BRL', incoming_value: 1000, expense_value: 300, net_income: 700 })
  })
})

describe('getConvertedBalance', () => {
  const rates = { BRL: 5.0, EUR: 0.9 }

  it('retorna null quando falta taxa', () => {
    const group = { reference: '2024-1', currencies: [
      { currency: 'GBP', incoming_value: 100, expense_value: 50, net_income: 50 },
    ]}
    expect(getConvertedBalance(group, 'USD', rates)).toBeNull()
  })
  it('retorna saldo correto', () => {
    const group = { reference: '2024-1', currencies: [
      { currency: 'BRL', incoming_value: 500, expense_value: 200, net_income: 300 },
      { currency: 'EUR', incoming_value: 180, expense_value: 90, net_income: 90 },
    ]}
    const result = getConvertedBalance(group, 'USD', rates)
    expect(result?.incoming).toBeCloseTo(300)
    expect(result?.expense).toBeCloseTo(140)
    expect(result?.net).toBeCloseTo(160)
  })
  it('net = incoming - expense', () => {
    const group = { reference: '2024-1', currencies: [
      { currency: 'BRL', incoming_value: 1000, expense_value: 400, net_income: 600 },
    ]}
    const result = getConvertedBalance(group, 'USD', rates)
    expect(result?.net).toBeCloseTo(result!.incoming - result!.expense)
  })
})
