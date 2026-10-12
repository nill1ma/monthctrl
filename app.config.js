const {
  withAndroidManifest,
  withGradleProperties,
} = require("@expo/config-plugins");

const APP_ID = "ca-app-pub-4958988852010027~2821861536";

const withGoogleMobileAdsManifest = (config) => {
  return withAndroidManifest(config, (config) => {
    const application = config.modResults.manifest.application[0];
    if (!application["meta-data"]) application["meta-data"] = [];
    application["meta-data"].push({
      $: {
        "android:name": "com.google.android.gms.ads.APPLICATION_ID",
        "android:value": APP_ID,
      },
    });
    return config;
  });
};

const withGoogleMobileAdsGradle = (config) => {
  return withGradleProperties(config, (config) => {
    config.modResults.push({
      type: "property",
      key: "googleMobileAdsJson",
      value: `{"android_app_id":"${APP_ID}"}`,
    });
    return config;
  });
};

module.exports = ({ config }) => {
  config = withGoogleMobileAdsManifest(config);
  config = withGoogleMobileAdsGradle(config);
  return {
    ...config,
    android: {
      ...config.android,
      newArchEnabled: false,
    },
    ios: {
      ...config.ios,
      newArchEnabled: false,
    },
  };
};
