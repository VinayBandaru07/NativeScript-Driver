const webpack = require("@nativescript/webpack");

webpack.chainWebpack(config => {
	config.resolve.alias.set('tns-core-modules', '@nativescript/core')
  })

module.exports = (env) => {
	webpack.init(env);

	// Learn how to customize:
	// https://docs.nativescript.org/webpack

	return webpack.resolveConfig();
};
