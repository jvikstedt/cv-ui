module.exports = {
  transpileDependencies: ["vuetify"],
  devServer: {
    proxy: {
      "/api/convert": {
        target: "http://localhost:3002",
        changeOrigin: true,
        secure: false,
      },
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false,
      },
    },
  },

  pluginOptions: {
    i18n: {
      locale: "en",
      fallbackLocale: "en",
      localeDir: "locales",
      enableInSFC: true,
    },
  },
  chainWebpack: (config) => {
    config.plugin("html").tap((args) => {
      args[0].title = "CV";
      return args;
    });
  },
  pwa: {
    workboxPluginMode: "GenerateSW",
    workboxOptions: {
      skipWaiting: true,
    },
  },
};
