// module.exports = {
//   preset: '@react-native/jest-preset',
//   transformIgnorePatterns: [
//     'node_modules/(?!(react-native|@react-native|react-redux|@reduxjs/toolkit|immer|@tanstack/react-query|@react-navigation|react-native-gesture-handler|react-native-screens|react-native-safe-area-context)/)',
//   ],
// };
module.exports = {
  preset: '@react-native/jest-preset',

  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|react-redux|@reduxjs/toolkit|immer|@tanstack/react-query|@react-navigation|react-native-gesture-handler|react-native-screens|react-native-safe-area-context)/)',
  ],
};