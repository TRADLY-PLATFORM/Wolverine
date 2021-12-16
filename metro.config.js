/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */

module.exports = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: false,
      },
    }),
  },
  resolver: {
    sourceExts: ["js", "ts", "jsx", "tsx"],
  },
  sourceExts: [ "js","jsx","svg","ts","tsx"]
};
module.exports = {
  resolver: {
    sourceExts: ["js", "ts", "jsx", "tsx", "json"],
  }
}