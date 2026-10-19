import { renderHook, act } from '@testing-library/react-native'

jest.mock('../lib/backup/sync-manager', () => ({ registerDebounceCancel: jest.fn() }))

jest.mock('react-native', () => {
  const remove = jest.fn()
  const addEventListener = jest.fn(() => ({ remove }))
  const AppState = {
    addEventListener,
    removeEventListener: jest.fn(),
    currentState: 'active',
    _remove: remove,
    _addEventListener: addEventListener,
  }
  return {
    AppState,
    Platform: { OS: 'ios', select: (o: any) => o.ios ?? o.default },
    StyleSheet: { create: (s: any) => s, flatten: (s: any) => s, hairlineWidth: 1, absoluteFill: {}, absoluteFillObject: {} },
    View: 'View', Text: 'Text', Pressable: 'Pressable',
  }
})

import { AppState } from 'react-native'
import { useBackgroundBackup } from '../hooks/use-background-backup'

const mockAdd = AppState.addEventListener as jest.Mock
const mockRemove = (AppState as any)._remove as jest.Mock

describe('useBackgroundBackup', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockAdd.mockReturnValue({ remove: mockRemove })
  })

  it('registra listener no AppState ao montar', () => {
    renderHook(() => useBackgroundBackup(jest.fn()))
    expect(mockAdd).toHaveBeenCalledWith('change', expect.any(Function))
  })

  it('chama flushFn quando vai para background', () => {
    const flushFn = jest.fn()
    renderHook(() => useBackgroundBackup(flushFn))
    act(() => mockAdd.mock.calls[0][1]('background'))
    expect(flushFn).toHaveBeenCalled()
  })

  it('não chama flushFn quando estado é active', () => {
    const flushFn = jest.fn()
    renderHook(() => useBackgroundBackup(flushFn))
    act(() => mockAdd.mock.calls[0][1]('active'))
    expect(flushFn).not.toHaveBeenCalled()
  })

  it('remove listener ao desmontar', () => {
    const { unmount } = renderHook(() => useBackgroundBackup(jest.fn()))
    unmount()
    expect(mockRemove).toHaveBeenCalled()
  })
})
