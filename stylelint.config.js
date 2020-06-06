'use strict';

module.exports = {
	extends: 'stylelint-config-standard',
	plugins: [
		'stylelint-order'
	],
	rules: {
		// Possible errors
		'at-rule-no-unknown': [
			true,
			{
				ignoreAtRules: ['mixin', 'for', 'include', 'each', 'extend', 'use']
			}
		],
		'font-family-no-missing-generic-family-keyword': null,
		'no-descending-specificity': null,

		// Limit language features

		// Stylistic issues
		indentation: 'tab',
		'selector-pseudo-element-colon-notation': null,

		// Plugins
		// stylelint-order
		'order/order': [
			'custom-properties',
			'declarations'
		],
		'order/properties-alphabetical-order': true
	},
	ignoreFiles: ['**/*.md', '**/*.html']
}
