'use strict';

const
	yeoman = require('yeoman-generator'),
	joi = require('joi');

module.exports = yeoman.Base.extend({
	constructor: function () {
		yeoman.Base.call(this, ...arguments);
	},

	prompting() {
		const
			done = this.async(),
			paths = Object.assign({}, this.config.get('paths'));

		this.prompt([
			{
				name: 'blocks',
				message: 'Specify relative path to the blocks directory',
				default: paths.blocks || './src/blocks',
				validate: (val) => Boolean(val && /^\.\//.test(val)) || 'Should begin with ./',
				filter: (val) => val && val.trim()
			},

			{
				name: 'disclaimer',
				message: 'Enter the path to the disclaimer file (or leave this field empty if you don\'t use it)',
				validate: (val) => !val || /^\.\//.test(val) || 'Should begin with ./',
				filter: (val) => val ? val.trim() : null
			}

		], (answers) => {
			this.config.set('paths', answers);
			done();
		});
	}
});
