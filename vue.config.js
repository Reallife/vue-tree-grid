module.exports = {
  css: {
    extract: false,
  },
  productionSourceMap: false,
  chainWebpack: (config) => {
    config.optimization.delete('splitChunks');
    config.output.chunkFilename('vue-tree-grid.js');
    if (process.env.NODE_ENV === 'production') {
      config.plugins.delete('html');
      config.plugins.delete('preload');
      config.plugins.delete('prefetch');
    }
  },
};
