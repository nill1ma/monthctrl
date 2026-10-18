import { changePasswordSchema } from '../schemas/change-password-schema'

describe('changePasswordSchema', () => {
  const valid = {
    currentPassword: 'senha123',
    newPassword: 'novaSenha1',
    confirmPassword: 'novaSenha1',
  }

  it('aceita dados válidos', () => {
    expect(changePasswordSchema.safeParse(valid).success).toBe(true)
  })
  it('rejeita currentPassword vazio', () => {
    expect(changePasswordSchema.safeParse({ ...valid, currentPassword: '' }).success).toBe(false)
  })
  it('rejeita newPassword com menos de 6 caracteres', () => {
    expect(changePasswordSchema.safeParse({ ...valid, newPassword: 'abc', confirmPassword: 'abc' }).success).toBe(false)
  })
  it('rejeita quando newPassword e confirmPassword são diferentes', () => {
    const result = changePasswordSchema.safeParse({ ...valid, confirmPassword: 'outraSenha' })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues.map(i => i.path[0])).toContain('confirmPassword')
    }
  })
  it('rejeita confirmPassword vazio', () => {
    expect(changePasswordSchema.safeParse({ ...valid, confirmPassword: '' }).success).toBe(false)
  })
  it('aceita newPassword com exatamente 6 caracteres', () => {
    expect(changePasswordSchema.safeParse({ ...valid, newPassword: 'abc123', confirmPassword: 'abc123' }).success).toBe(true)
  })
})
