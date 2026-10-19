
// Instala Response global antes que expo/src/winter/fetch/FetchResponse tente extendê-lo
if (typeof globalThis.Response === 'undefined') {
  globalThis.Response = class Response {
    constructor(body, init) { this.body = body; this.status = (init || {}).status || 200; }
  };
}
if (typeof globalThis.Request === 'undefined') {
  globalThis.Request = class Request {
    constructor(url, init) { this.url = url; }
  };
}
if (typeof globalThis.Headers === 'undefined') {
  globalThis.Headers = class Headers {
    constructor(init) { this._h = {}; }
    get(k) { return this._h[k]; }
    set(k, v) { this._h[k] = v; }
    has(k) { return k in this._h; }
  };
}
// Mock expo-modules-core para evitar requireNativeModule
jest.mock('expo-modules-core', () => ({
  NativeModulesProxy: {},
  EventEmitter: jest.fn(() => ({ addListener: jest.fn(), removeAllListeners: jest.fn() })),
  Platform: { OS: 'ios', select: (obj) => obj.ios !== undefined ? obj.ios : obj.default, isPad: false, isTV: false },
  requireNativeModule: jest.fn(() => ({})),
  requireOptionalNativeModule: jest.fn(() => null),
  CodedError: class CodedError extends Error {},
  UnavailabilityError: class UnavailabilityError extends Error {},
}));
