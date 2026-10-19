import { getCurrentFeference } from '../utils/text-format'

describe('getCurrentFeference', () => {
  it('retorna referência no formato YYYY-M', () => {
    const result = getCurrentFeference()
    const now = new Date()
    const expected = `${now.getFullYear()}-${now.getMonth() + 1}`
    expect(result).toBe(expected)
  })

  it('retorna string com ano de 4 dígitos', () => {
    const result = getCurrentFeference()
    expect(result).toMatch(/^\d{4}-\d{1,2}$/)
  })
})
