module.exports = ({ config }) => ({
  ...config,
  "react-native-google-mobile-ads": {
    android_app_id: "ca-app-pub-4958988852010027~2821861536",
    ios_app_id: "ca-app-pub-4958988852010027~2821861536",
  },
  android: {
    ...config.android,
    newArchEnabled: false,
  },
  ios: {
    ...config.ios,
    newArchEnabled: false,
  },
});
