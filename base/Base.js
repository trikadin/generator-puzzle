require('sugar');

const
	yeoman = require('yeoman-generator'),
	fs = require('fs');

module.exports = {
	_validateBlockName(name) {
		return /^[gibp]-[a-z0-9-]+$/.test(name);
	},

	initializing: {
		setPath() {
			this.destinationRoot(this.config.get('paths').blocks);
		},

		loadBlocksList() {
			this.blocksList = fs.readdirSync(this.destinationPath()).filter(this._validateBlockName).sort();
		}
	},

	writing: {
		setPath() {
			this.destinationRoot(this.blockName);
			this.log(this.destinationPath());
		}
	}
};
