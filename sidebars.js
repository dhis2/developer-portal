// importing both sidebars to be loaded.
const sideBarReferences = require('./sidebarsReferences.js')
const sidebarsGuides = require('./sidebarsGuides.js')

module.exports = {
    references: sideBarReferences.references,
    docs: sidebarsGuides.docs,
}
