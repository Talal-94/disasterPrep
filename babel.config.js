/** @type {import('react-native-unistyles/plugin').UnistylesPluginOptions} */
const unistyles = {
  include: ["app/**/*", "components/**/*"],
  root: "app",
};

module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      ["react-native-unistyles/plugin", unistyles],
      // keep Reanimated last
      "react-native-reanimated/plugin",
    ],
  };
};
