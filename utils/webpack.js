const displayWebpackStats = (err, stats) => {
	if (err) {
		console.error(err.stack || err); // eslint-disable-line
		if (err.details) {
			console.error(err.details); // eslint-disable-line
		}
		return;
	}

	process.stdout.write(`${stats.toString({ colors: true })}\n`);
};

module.exports = {
	displayWebpackStats,
};
