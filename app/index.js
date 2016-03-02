const
	yeoman = require('yeoman-generator'),
	joi = require('joi');

module.exports = yeoman.Base.extend({
	constructor: function () {
		yeoman.Base.apply(this, arguments);
	},

	prompting() {
		const
			done = this.async(),
			paths = this.config.get('paths') || {};

		this.prompt([
			{
				name: 'blocks',
				message: 'Specify relative path to the blocks directory',
				default: paths.blocks || './src/blocks',
				validate: (val) => (val && /^\.\//.test(val)) ? true : 'Should begin with ./',
				filter: (val) => val && val.trim()
			}
		], (answers) => {
			this.config.set('paths', answers);
			done();
		});
	}
});
