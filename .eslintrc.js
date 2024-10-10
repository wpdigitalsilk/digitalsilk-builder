module.exports = {
	extends: ['@digitalsilk/eslint-config/node', '@digitalsilk/eslint-config/jest', '@digitalsilk/eslint-config'],
	ignorePatterns: ['node_modules', '__tests__', 'test-utils', 'jest'],
	rules: {
		'global-require': 'off',
		'import/no-dynamic-require': 'off',
		'no-process-exit': 'off',
		'no-console': 0,
	},
};
