'use strict';

const
	yeoman = require('yeoman-generator'),
	Base = require('../base/Base');

module.exports = yeoman.Base.extend(Object.merge(Base, {
	constructor: function () {
		yeoman.Base.call(this, ...arguments);
	},

	_validateMod(val) {
		return /^[a-z0-9-]+$/.test(val);
	},

	prompting() {
		const
			done = this.async();

		this.prompt([
			{
				name: 'blockName',
				message: 'Select block',
				type: 'list',
				choices: this.blocksList,
				default: () => this.blocksList.find(/^b/)
			},

			{
				name: 'mod',
				message: 'Enter modifiers name:',
				validate: (val) => this._validateMod(val) || `Modifier name should match pattern /^[a-z0-9-]+$/`,
				filter: (val) => val && val.trim()
			},

			{
				name: 'value',
				message: 'Enter modifiers value:',
				default: 'true',
				validate: (val) => this._validateMod(val) || `Modifier name should match pattern /^[a-z0-9-]+$/`,
				filter: (val) => val && val.trim()
			}
		], (answers) => {
			Object.assign(this, answers);
			done();
		});
	},

	writing: {
		writing() {
			this.fs.copyTpl(
				this.templatePath('stylus.ejs'),
				this.destinationPath(`${this.blockName}_${this.mod}_${this.value}.styl`),
				this
			);
		}
	}
}, true));
