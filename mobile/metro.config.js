const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Polyfill Node.js built-ins that @solana/web3.js expects
// Note: expo-crypto is used directly in our code (not as a Node polyfill)
// The web3.js crypto usage is handled by Hermes built-in crypto or react-native polyfills
config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
};

module.exports = config;
