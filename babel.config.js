module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      'babel-preset-expo',
      '@babel/preset-flow',  // ✅ Add this line
      '@babel/preset-typescript', // If TypeScript is used
    ],
    plugins: [
      // 'react-native-reanimated/plugin', // Comment out if still causing issues
    ],
  };
};