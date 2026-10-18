import { incomingSchema, expenseSchema } from '../schemas/transaction-schema'

describe('incomingSchema', () => {
  const valid = {
    reference: '2024-1',
    value: '100.00',
    currency: 'BRL',
    category_id: 'cat-1',
    origin: 'Salário',
  }

  it('aceita dados válidos', () => {
    expect(incomingSchema.safeParse(valid).success).toBe(true)
  })
  it('rejeita reference vazio', () => {
    expect(incomingSchema.safeParse({ ...valid, reference: '' }).success).toBe(false)
  })
  it('rejeita value zero', () => {
    expect(incomingSchema.safeParse({ ...valid, value: '0' }).success).toBe(false)
  })
  it('rejeita value negativo', () => {
    expect(incomingSchema.safeParse({ ...valid, value: '-10' }).success).toBe(false)
  })
  it('rejeita value não numérico', () => {
    expect(incomingSchema.safeParse({ ...valid, value: 'abc' }).success).toBe(false)
  })
  it('rejeita currency vazio', () => {
    expect(incomingSchema.safeParse({ ...valid, currency: '' }).success).toBe(false)
  })
  it('rejeita category_id vazio', () => {
    expect(incomingSchema.safeParse({ ...valid, category_id: '' }).success).toBe(false)
  })
  it('rejeita origin vazio', () => {
    expect(incomingSchema.safeParse({ ...valid, origin: '' }).success).toBe(false)
  })
})

describe('expenseSchema', () => {
  const valid = {
    reference: '2024-1',
    value: '50.00',
    currency: 'USD',
    category_id: 'cat-2',
    destination: 'Mercado',
  }

  it('aceita dados válidos', () => {
    expect(expenseSchema.safeParse(valid).success).toBe(true)
  })
  it('rejeita destination vazio', () => {
    expect(expenseSchema.safeParse({ ...valid, destination: '' }).success).toBe(false)
  })
  it('rejeita value como string vazia', () => {
    expect(expenseSchema.safeParse({ ...valid, value: '' }).success).toBe(false)
  })
  it('aceita value decimal', () => {
    expect(expenseSchema.safeParse({ ...valid, value: '99.99' }).success).toBe(true)
  })
})
