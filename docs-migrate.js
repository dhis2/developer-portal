const { execSync } = require('child_process')
const fs = require('fs-extra')

try {
    // Clone the repository and switch to the "docs-improve" branch
    execSync(
        'git clone --depth 1 https://github.com/dhis2/cli.git --branch docs-improve .cli-repo-temp'
    )

    // Remove any previous copy
    fs.removeSync('./docs/cli')

    // Copy the directory to another place and create missing directories
    fs.copySync('.cli-repo-temp/docs', './docs/cli', { recursive: true })

    // Remove the checked out code
    fs.removeSync('.cli-repo-temp')
} catch (error) {
    console.error(error)
}
