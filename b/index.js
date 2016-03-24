'use strict';

require('sugar');

const
	yeoman = require('yeoman-generator'),
	Base = require('../base/Base');

module.exports = yeoman.Base.extend(Object.merge(Base, {
	constructor: function () {
		yeoman.Base.call(this, ...arguments);

		this.argument('blockName', {
			type: String,
			optional: true,
			desc: 'Name of the created block',
			defaults: ''
		});

		this.option('parent', {
			desc: 'Parent block',
			type: String,
			alias: 'p'
		});
	},

	initializing: {
		validateName() {
			if (!this.blockName) {
				return;
			}

			if (!this._validateBlockName(this.blockName)) {
				this.log(`Invalid block name "${this.blockName}" (should match pattern "^[gibp]-[a-z0-9-]*$")`);
				this.blockName = false;

			} else if (this.blocksList.indexOf(this.blockName) !== -1) {
				this.log(`Block ${this.blockName} is already exists`);
				this.blockName = false;
			}
		},

		validateParent() {
			const
				parent = this.options.parent;

			if (parent && (this.blocksList.indexOf(parent) === -1)) {
				this.log(`Parent block ${parent} is not exists`);
				this.options.parent = false;
			}
		}
	},

	prompting() {
		const
			done = this.async(),
			empty = {
				name: '--none---',
				value: null,
				short: 'none'
			};

		this.prompt([
			{
				name: 'blockName',
				message: 'Enter the name of the created block',
				validate: (val) =>
					this._validateBlockName(val) ? true : `Invalid block name "${val}" (should match pattern "^[gibp]-[a-z0-9-]*$")`,

				filter: (val) => val && val.trim(),
				when: () => !this.blockName
			},

			{
				name: 'parent',
				message: 'Select the parent block',
				type: 'list',
				choices: this.blocksList.concat([empty]),
				default: (answers) => {
					const
						blockName = this.blockName || answers.blockName;

					switch (blockName.charAt(0)) {
						case 'p':
							return this.blocksList.indexOf('i-page');

						case 'b':
							return this.blocksList.indexOf('i-block');

						case 'g':
							return this.blocksList.length;

						default:
							return this.blocksList.indexOf('i-base');
					}
				},

				when: () => !this.parent
			},

			{
				name: 'dependencies',
				message: 'Check dependencies of the block',
				type: 'checkbox',
				choices: this.blocksList.filter((val) => val.charAt(0) !== 'i')
			}

		], (answers) => {
			Object.assign(this, answers);
			done();
		});
	},

	writing: {
		writing() {
		this.fs.copyTpl(
			this.templatePath('index.ejs'),
			this.destinationPath('index.js'),
			this
		);

		this.fs.copyTpl(
			this.templatePath('class.ejs'),
			this.destinationPath(`${this.blockName}.js`),
			this
		);

		this.fs.copyTpl(
			this.templatePath('template.ejs'),
			this.destinationPath(
				this.blockName + (this.blockName.charAt(0) === 'p' ? '.ess' : '.ss')
			),
			this
		);

		this.fs.copyTpl(
			this.templatePath('stylus.interface.ejs'),
			this.destinationPath(`${this.blockName}.interface.styl`),
			this
		);

		if (this.blockName.charAt(0) !== 'i') {
			this.fs.copyTpl(
				this.templatePath('stylus.ejs'),
				this.destinationPath(`${this.blockName}.styl`),
				this
			);
		}
	}

	}
}, true));
