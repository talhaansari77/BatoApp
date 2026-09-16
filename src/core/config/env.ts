// Central place for app environment/config values.
// Later we can move this to Expo env variables.
const MY_MAC_IP = '172.20.10.6';

export const env = {
  // iOS Simulator can use localhost.
  // Android Emulator usually needs 10.0.2.2.
  // Real device needs your Mac local IP address.
  API_BASE_URL: `http://${MY_MAC_IP}:5243/api`,
};