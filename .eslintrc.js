/* eslint-disabled */
module.exports = {
	env: {
		browser: false,
		es2021: true
	},
	extends: ['standard', 'eslint:recommended', 'prettier'],
	overrides: [],
	parserOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module'
	},
	plugins: ['prettier'],
	rules: {
		'no-useless-catch': 'warn',
		camelcase: [
			2,
			{
				properties: 'always'
			}
		],
		eqeqeq: [2, 'smart'],
		'prettier/prettier': [
			'warn',
			{
				printWidth: 120,
				useTabs: true,
				singleQuote: true,
				tabWidth: 3,
				trailingComma: 'none'
			}
		]
	}
};
