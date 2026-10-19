/* eslint-env jest */
// Patch direto no módulo react-native já carregado pelo jest-expo
// Necessário porque moduleNameMapper do preset não pode ser sobrescrito
const RN = require('react-native');
const mockRemove = jest.fn();
const mockAdd = jest.fn(() => ({ remove: mockRemove }));
Object.defineProperty(RN.AppState, 'addEventListener', { value: mockAdd, writable: true, configurable: true });
Object.defineProperty(RN.AppState, '_mockAddEventListener', { value: mockAdd, writable: true, configurable: true });
Object.defineProperty(RN.AppState, '_mockRemove', { value: mockRemove, writable: true, configurable: true });
