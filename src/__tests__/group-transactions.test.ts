import { groupByReference } from '../utils/group-transactions'

const makeRow = (overrides = {}) => ({
  reference: '2024-1',
  currency: 'BRL',
  incoming_value: 0,
  expense_value: 0,
  net_income: 0,
  ...overrides,
})

describe('groupByReference', () => {
  it('retorna array vazio para input vazio', () => {
    expect(groupByReference([])).toEqual([])
  })
  it('agrupa uma única linha corretamente', () => {
    const result = groupByReference([makeRow({ incoming_value: 1000, expense_value: 400, net_income: 600 })])
    expect(result).toHaveLength(1)
    expect(result[0].incoming_value).toBe(1000)
    expect(result[0].currencies).toEqual(['BRL'])
  })
  it('soma valores de múltiplas linhas com a mesma reference', () => {
    const result = groupByReference([
      makeRow({ incoming_value: 500, expense_value: 200, net_income: 300 }),
      makeRow({ incoming_value: 300, expense_value: 100, net_income: 200 }),
    ])
    expect(result).toHaveLength(1)
    expect(result[0].incoming_value).toBe(800)
    expect(result[0].expense_value).toBe(300)
  })
  it('separa references diferentes', () => {
    const result = groupByReference([
      makeRow({ reference: '2024-1' }),
      makeRow({ reference: '2024-2' }),
    ])
    expect(result).toHaveLength(2)
  })
  it('acumula currencies sem duplicatas', () => {
    const result = groupByReference([
      makeRow({ currency: 'BRL' }),
      makeRow({ currency: 'USD' }),
      makeRow({ currency: 'BRL' }),
    ])
    expect(result[0].currencies).toHaveLength(2)
    expect(result[0].currencies).toContain('USD')
  })
})
