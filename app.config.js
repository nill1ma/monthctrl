module.exports = ({ config }) => ({
  ...config,
  android: {
    ...config.android,
    newArchEnabled: false,
  },
  ios: {
    ...config.ios,
    newArchEnabled: false,
  },
});
