var devConf = require('./webpack.config.js');
devConf.devtool = 'eval';

module.exports = devConf;