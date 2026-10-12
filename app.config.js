const { withAndroidManifest } = require("@expo/config-plugins");

const withGoogleMobileAds = (config) => {
  return withAndroidManifest(config, (config) => {
    const manifest = config.modResults;
    const application = manifest.manifest.application[0];

    if (!application["meta-data"]) {
      application["meta-data"] = [];
    }

    application["meta-data"].push({
      $: {
        "android:name": "com.google.android.gms.ads.APPLICATION_ID",
        "android:value": "ca-app-pub-4958988852010027~2821861536",
      },
    });

    return config;
  });
};

module.exports = ({ config }) => {
  config = withGoogleMobileAds(config);
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
