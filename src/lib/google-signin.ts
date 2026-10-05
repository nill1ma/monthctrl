import { GoogleSignin } from "@react-native-google-signin/google-signin";

GoogleSignin.configure({
  webClientId: process.env.GOOGLE_WEB_CLIENT,
  offlineAccess: true,
});
