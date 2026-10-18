import { getCurrencyFlag, getCurrencyDecimals, convertToDisplayCurrency, applyCurrencyMask, formatCurrency } from '../lib/currency'

describe('getCurrencyFlag', () => {
  it('retorna flag do BRL', () => { expect(getCurrencyFlag('BRL')).toBe('🇧🇷') })
  it('retorna flag do USD', () => { expect(getCurrencyFlag('USD')).toBe('🇺🇸') })
  it('retorna emoji genérico para moeda desconhecida', () => { expect(getCurrencyFlag('XYZ')).toBe('💱') })
})

describe('getCurrencyDecimals', () => {
  it('retorna 2 para BRL', () => { expect(getCurrencyDecimals('BRL')).toBe(2) })
  it('retorna 2 para USD', () => { expect(getCurrencyDecimals('USD')).toBe(2) })
  it('retorna 0 para JPY', () => { expect(getCurrencyDecimals('JPY')).toBe(0) })
})

describe('convertToDisplayCurrency', () => {
  const rates = { BRL: 5.0, EUR: 0.9 }
  it('retorna mesmo valor quando moedas são iguais', () => {
    expect(convertToDisplayCurrency(100, 'USD', 'USD', rates)).toBe(100)
  })
  it('converte BRL para USD', () => {
    expect(convertToDisplayCurrency(500, 'BRL', 'USD', rates)).toBeCloseTo(100)
  })
  it('retorna null quando taxa não existe', () => {
    expect(convertToDisplayCurrency(100, 'GBP', 'USD', rates)).toBeNull()
  })
})

describe('applyCurrencyMask', () => {
  it('formata com 2 decimais', () => { expect(applyCurrencyMask('12345', 2)).toBe('123.45') })
  it('formata com 0 decimais', () => { expect(applyCurrencyMask('999', 0)).toBe('999') })
  it('retorna vazio para input vazio', () => { expect(applyCurrencyMask('', 2)).toBe('') })
  it('ignora caracteres não numéricos', () => { expect(applyCurrencyMask('1a2b3', 2)).toBe('1.23') })
  it('padding em valor pequeno', () => { expect(applyCurrencyMask('5', 2)).toBe('0.05') })
})

describe('formatCurrency', () => {
  it('formata BRL', () => { expect(formatCurrency(1234.56, 'BRL', 'pt-BR')).toContain('1.234,56') })
  it('formata USD', () => { expect(formatCurrency(1000, 'USD', 'en-US')).toContain('1,000.00') })
})
