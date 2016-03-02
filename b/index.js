require('sugar');

const
	yeoman = require('yeoman-generator'),
	fs = require('fs');

function validateBlockName(name) {
	return /^[gibp]-[a-z0-9-]*$/.test(name);
}

module.exports = yeoman.Base.extend({
	constructor: function () {
		yeoman.Base.apply(this, arguments);

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
		setPath() {
			this.destinationRoot(this.config.get('paths').blocks);
		},

		loadBlocksList() {
			this.blocksList =
				fs
					.readdirSync(this.destinationPath())
					.filter(validateBlockName)
					.sort();
		},

		validateName() {
			if (!this.blockName) {
				return;
			}

			if (!validateBlockName(this.blockName)) {
				this.log(`Invalid block name "${this.blockName}" (should match pattern "^[gibp]-[a-z0-9-]*$")`);
				this.blockName = false;
			} else if (this.blocksList.indexOf(this.blockName) !== -1) {
				this.log(`Block ${this.blockName} is already exists`);
				this.blockName = false;
			}
		},

		validateParent() {
			const parent = this.options.parent;
			if (parent && (this.blocksList.indexOf(parent) === -1)) {
				this.log(`Parent block ${parent} is not exists`);
				this.options.parent = false;
			}
		}
	},

	prompting() {
		const done = this.async();

		this.prompt([
			{
				name: 'blockName',
				message: 'Enter the name of the created block',
				validate: (val) =>
					validateBlockName(val) ? true : `Invalid block name "${val}" (should match pattern "^[gibp]-[a-z0-9-]*$")`,
				filter: (val) => val && val.trim(),
				when: () => !this.blockName
			},

			{
				name: 'parent',
				message: 'Select the parent block',
				type: 'list',
				choices: this.blocksList,
				default: (answers) => {
					const blockName = this.blockName || answers.blockName;
					switch (blockName.charAt(0)) {
						case 'p':
							return this.blocksList.indexOf('i-page');

						case 'b':
							return this.blocksList.indexOf('i-block');

						default:
							return this.blocksList.indexOf('i-base');
					}
				},
				filter: (val) => val && val.trim(),
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

	writing() {
		this.destinationRoot(this.blockName)
		this.log(this.destinationPath());
		this.fs.copyTpl(
			this.templatePath('index.ejs'),
			this.destinationPath('index.js'),
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
			this.destinationPath(this.blockName + '.interface.styl'),
			this
		);

		if (this.blockName.charAt(0) !== 'i') {
			this.fs.copyTpl(
				this.templatePath('stylus.ejs'),
				this.destinationPath(this.blockName + '.styl'),
				this
			);
		}

	}
});
