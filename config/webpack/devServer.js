const path = require('path');

module.exports = ({ isPackage, projectConfig: { devServer, devURL, hot, devServerPort } }) => {
	if (!devServer && !hot) {
		return undefined;
	}

	if (isPackage && devServer) {
		return {
			compress: true,
			port: Number(devServerPort),
		};
	}

	if (!isPackage && hot) {
		const allowedHosts = ['.test', '.local'];

		try {
			allowedHosts.push(new URL(devURL).host);
		} catch (e) {
			// do nothing
		}

		return {
			static: {
				directory: path.resolve(process.cwd(), path.join('dist')),
				watch: false,
			},
			watchFiles: ['dist/blocks/**/*.css'],
			devMiddleware: {
				writeToDisk: true,
			},
			allowedHosts,
			hot: true,
			liveReload: true,
			client: {
				overlay: {
					errors: true,
					warnings: false,
				},
				reconnect: 5,
			},
			port: Number(devServerPort),
		};
	}

	return undefined;
};
