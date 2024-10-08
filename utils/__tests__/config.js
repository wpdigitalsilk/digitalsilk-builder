import {
	getDefaultConfig,
	getDSScriptsConfig,
	getDSScriptsPackageBuildConfig,
} from '../config';
import { getPackage as getPackageMock } from '../package';

jest.mock('../package', () => {
	const module = jest.requireActual('../package');

	jest.spyOn(module, 'getPackage');

	return module;
});

describe('getDSScriptsConfig', () => {
	afterEach(() => {
		getPackageMock.mockReset();
	});

	it('returns defaults values if config is not set', () => {
		getPackageMock.mockReturnValueOnce({});

		expect(getDSScriptsConfig()).toEqual(getDefaultConfig());
	});

	it('overrides and merges config properly', () => {
		getPackageMock.mockReturnValueOnce({
			'digitalsilk-setup': {
				entry: {
					'entry1.js': 'dist/output.js',
				},
				filenames: {
					blockCSS: 'blocks/[name]/editor2.css',
				},
				paths: {
					srcDir: './assets2/',
				},
			},
		});

		const defaultConfig = getDefaultConfig();

		expect(getDSScriptsConfig()).toEqual({
			...defaultConfig,
			entry: {
				'entry1.js': 'dist/output.js',
			},
			filenames: {
				...defaultConfig.filenames,
				blockCSS: 'blocks/[name]/editor2.css',
			},
			paths: {
				...defaultConfig.paths,
				srcDir: './assets2/',
			},
		});
	});
});

describe('getDSScriptsPackageBuildConfig', () => {
	afterEach(() => {
		getPackageMock.mockReset();
	});

	it('returns valid package build config', () => {
		getPackageMock.mockReturnValue({
			name: '@digitalsilk/component-library',
			source: 'src/index.js',
			main: 'dist/index.js',
			'umd:main': 'dist/index.umd.js',
			dependencies: {
				'read-pkg': '5.2.0',
				'read-pkg-up': '7.0.1',
				'resolve-bin': '^1.0.1',
			},
		});

		expect(getDSScriptsPackageBuildConfig()).toEqual({
			source: 'src/index.js',
			main: 'dist/index.js',
			umd: 'dist/index.umd.js',
			exports: {},
			externals: ['read-pkg', 'read-pkg-up', 'resolve-bin'],
			libraryName: 'componentLibrary',
			packageType: 'all',
			target: '',
		});

		getPackageMock.mockReset();

		getPackageMock.mockReturnValue({
			name: '@digitalsilk/component-library',
			source: 'src/index.js',
			main: 'dist/index.js',
			'umd:main': 'dist/index.umd.js',
			style: 'dist/index.css',
			dependencies: {
				'read-pkg': '5.2.0',
				'read-pkg-up': '7.0.1',
				'resolve-bin': '^1.0.1',
			},
			exports: {
				'*': './dist/index.js',
				'./utils': './dist/utils.js',
			},
			'digitalsilk-setup': {
				libraryName: 'myComponentLibrary',
			},
		});

		expect(getDSScriptsPackageBuildConfig()).toEqual({
			source: 'src/index.js',
			main: 'dist/index.js',
			umd: 'dist/index.umd.js',
			style: 'dist/index.css',
			exports: {
				'*': './dist/index.js',
				'./utils': './dist/utils.js',
			},
			externals: ['read-pkg', 'read-pkg-up', 'resolve-bin'],
			libraryName: 'myComponentLibrary',
			packageType: 'all',
			target: '',
		});
	});

	it('builds config taking cli args into account', () => {
		process.argv.push('--external=none');

		getPackageMock.mockReturnValue({
			name: '@digitalsilk/component-library',
			source: 'src/index.js',
			main: 'dist/index.js',
			'umd:main': 'dist/index.umd.js',
			dependencies: {
				'read-pkg': '5.2.0',
				'read-pkg-up': '7.0.1',
				'resolve-bin': '^1.0.1',
			},
			'@digitalsilk/scripts': {
				libraryName: 'myComponentLibrary',
				packageType: 'commonjs',
			},
		});

		expect(getDSScriptsPackageBuildConfig()).toEqual({
			source: 'src/index.js',
			main: 'dist/index.js',
			umd: false,
			exports: {},
			externals: [],
			libraryName: 'myComponentLibrary',
			packageType: 'commonjs2',
			target: '',
		});

		getPackageMock.mockReturnValue({
			name: '@digitalsilk/component-library',
			source: 'src/index.js',
			main: 'dist/index.js',
			'umd:main': 'dist/index.umd.js',
			dependencies: {
				'read-pkg': '5.2.0',
				'read-pkg-up': '7.0.1',
				'resolve-bin': '^1.0.1',
			},
			'@digitalsilk/scripts': {
				libraryName: 'myComponentLibrary',
				packageType: 'assign-properties',
			},
		});

		// override the definated packageType
		process.argv.push('--format=commonjs');

		expect(getDSScriptsPackageBuildConfig()).toEqual({
			source: 'src/index.js',
			main: 'dist/index.js',
			umd: false,
			exports: {},
			externals: [],
			libraryName: 'myComponentLibrary',
			packageType: 'commonjs2',
			target: '',
		});

		process.argv.pop();
		process.argv.push('-f=commonjs');

		expect(getDSScriptsPackageBuildConfig()).toEqual({
			source: 'src/index.js',
			main: 'dist/index.js',
			umd: false,
			exports: {},
			externals: [],
			libraryName: 'myComponentLibrary',
			packageType: 'commonjs2',
			target: '',
		});

		process.argv.push('-i=src/index.umd.js');
		process.argv.push('-o=dist/index.umd.js');
		process.argv.push('--name=ComponentLibrary');
		process.argv.push('--target=node');

		expect(getDSScriptsPackageBuildConfig()).toEqual({
			source: 'src/index.umd.js',
			main: 'dist/index.umd.js',
			umd: false,
			exports: {},
			externals: [],
			libraryName: 'ComponentLibrary',
			packageType: 'commonjs2',
			target: 'node',
		});
	});
});
