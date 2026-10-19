
// Mocka o módulo problemático do expo que quebra no jest-expo 57
jest.mock('expo-modules-core', () => ({
  NativeModulesProxy: {},
  EventEmitter: jest.fn(() => ({ addListener: jest.fn(), removeAllListeners: jest.fn() })),
  Platform: { OS: 'ios', select: (obj) => obj.ios ?? obj.default },
  requireNativeModule: jest.fn(() => ({})),
  requireOptionalNativeModule: jest.fn(() => null),
  CodedError: class CodedError extends Error {},
}));
