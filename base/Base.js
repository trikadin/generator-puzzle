require('sugar');

const
	fs = require('fs');

module.exports = {
	_validateBlockName(name) {
		return /^[gibp]-[a-z0-9-]+$/.test(name);
	},

	initializing: {
		loadDisclaimer() {
			this.disclaimer = null;
			const disclaimerPath = this.config.get('paths').disclaimer;

			if (disclaimerPath) {
				try {
					this.disclaimer = fs.readFileSync(this.destinationPath(disclaimerPath));

				} catch (err) {
					this.log(`Failed to load disclaimer file ${this.destinationPath(disclaimerPath)}`);
				}
			}
		},

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
