const appJson = require("./app.json");

module.exports = {
  ...appJson.expo,
  android: {
    ...appJson.expo.android,
    newArchEnabled: false,
  },
  ios: {
    ...appJson.expo.ios,
    newArchEnabled: false,
  },
};
