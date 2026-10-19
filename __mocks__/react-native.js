const mockRemove = jest.fn()
const mockAddEventListener = jest.fn(() => ({ remove: mockRemove }))

const AppState = {
  addEventListener: mockAddEventListener,
  removeEventListener: jest.fn(),
  currentState: 'active',
  _mockRemove: mockRemove,
  _mockAddEventListener: mockAddEventListener,
}

module.exports = {
  AppState,
  Platform: { OS: 'ios', select: (obj) => obj.ios ?? obj.default, Version: 14 },
  NativeModules: {},
  StyleSheet: { create: (styles) => styles, flatten: (s) => s, hairlineWidth: 1, absoluteFill: {}, absoluteFillObject: { position:'absolute',left:0,right:0,top:0,bottom:0 } },
  View: 'View', Text: 'Text', TouchableOpacity: 'TouchableOpacity',
  TouchableHighlight: 'TouchableHighlight', TouchableWithoutFeedback: 'TouchableWithoutFeedback',
  Pressable: 'Pressable', ScrollView: 'ScrollView', FlatList: 'FlatList',
  SectionList: 'SectionList', TextInput: 'TextInput', Image: 'Image',
  Modal: 'Modal', ActivityIndicator: 'ActivityIndicator',
  Alert: { alert: jest.fn() },
  Animated: {
    Value: jest.fn(() => ({ interpolate: jest.fn(), setValue: jest.fn() })),
    timing: jest.fn(() => ({ start: jest.fn() })),
    spring: jest.fn(() => ({ start: jest.fn() })),
    parallel: jest.fn(() => ({ start: jest.fn() })),
    sequence: jest.fn(() => ({ start: jest.fn() })),
    View: 'Animated.View', Text: 'Animated.Text',
    createAnimatedComponent: (c) => c,
    event: jest.fn(), add: jest.fn(),
  },
  Dimensions: { get: jest.fn(() => ({ width: 375, height: 812 })), addEventListener: jest.fn(), removeEventListener: jest.fn() },
  Keyboard: { addListener: jest.fn(() => ({ remove: jest.fn() })), removeListener: jest.fn(), dismiss: jest.fn() },
  Linking: { openURL: jest.fn(), canOpenURL: jest.fn(() => Promise.resolve(true)), getInitialURL: jest.fn(() => Promise.resolve(null)), addEventListener: jest.fn() },
  PixelRatio: { get: jest.fn(() => 2), getPixelSizeForLayoutSize: jest.fn((s) => s * 2) },
  BackHandler: { addEventListener: jest.fn(() => ({ remove: jest.fn() })), removeEventListener: jest.fn() },
  AccessibilityInfo: { addEventListener: jest.fn(() => ({ remove: jest.fn() })), isScreenReaderEnabled: jest.fn(() => Promise.resolve(false)) },
  I18nManager: { isRTL: false },
  Vibration: { vibrate: jest.fn(), cancel: jest.fn() },
  Share: { share: jest.fn() },
  Clipboard: { getString: jest.fn(), setString: jest.fn() },
  DeviceEventEmitter: { addListener: jest.fn(() => ({ remove: jest.fn() })), removeAllListeners: jest.fn(), emit: jest.fn() },
  NativeEventEmitter: jest.fn(() => ({ addListener: jest.fn(() => ({ remove: jest.fn() })), removeAllListeners: jest.fn() })),
  requireNativeComponent: jest.fn(() => 'View'),
  findNodeHandle: jest.fn(),
  useColorScheme: jest.fn(() => 'light'),
  useWindowDimensions: jest.fn(() => ({ width: 375, height: 812, scale: 2, fontScale: 1 })),
}
