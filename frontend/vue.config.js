const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:3333', // Le port par défaut d'AdonisJS
        changeOrigin: true
      }
    }
  }
})
