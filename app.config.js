const appJson = require("./app.json");

module.exports = {
  ...appJson.expo,
  "react-native-google-mobile-ads": {
    android_app_id: "ca-app-pub-4958988852010027~2821861536",
    ios_app_id: "ca-app-pub-4958988852010027~2821861536",
  },
  android: {
    ...appJson.expo.android,
    newArchEnabled: false,
  },
  ios: {
    ...appJson.expo.ios,
    newArchEnabled: false,
  },
};
