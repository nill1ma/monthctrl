import {
  getIsRestoring,
  registerDebounceCancel,
  setRestoring,
} from '../lib/backup/sync-manager'

beforeEach(() => {
  setRestoring(false)
  registerDebounceCancel(() => {})
})

describe('sync-manager', () => {
  describe('setRestoring / getIsRestoring', () => {
    it('começa como false', () => {
      expect(getIsRestoring()).toBe(false)
    })

    it('setRestoring(true) muda para true', () => {
      setRestoring(true)
      expect(getIsRestoring()).toBe(true)
    })

    it('setRestoring(false) muda para false', () => {
      setRestoring(true)
      setRestoring(false)
      expect(getIsRestoring()).toBe(false)
    })
  })

  describe('registerDebounceCancel', () => {
    it('ao setRestoring(true), chama a função de cancelamento registrada', () => {
      const cancelFn = jest.fn()
      registerDebounceCancel(cancelFn)
      setRestoring(true)
      expect(cancelFn).toHaveBeenCalledTimes(1)
    })

    it('não chama cancelFn ao setRestoring(false)', () => {
      const cancelFn = jest.fn()
      registerDebounceCancel(cancelFn)
      setRestoring(false)
      expect(cancelFn).not.toHaveBeenCalled()
    })

    it('após cancelFn ser chamada, não é chamada novamente em um segundo setRestoring(true)', () => {
      const cancelFn = jest.fn()
      registerDebounceCancel(cancelFn)
      setRestoring(true)
      setRestoring(false)
      setRestoring(true)
      expect(cancelFn).toHaveBeenCalledTimes(1)
    })
  })
})
