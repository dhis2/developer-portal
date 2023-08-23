const { execSync } = require('child_process')
const fs = require('fs-extra')

try {
    // just in case, remove any previous copy
    fs.removeSync('.cli-repo-temp')

    // Clone the repository and switch to the "docs-improve" branch
    execSync(
        'git clone --depth 1 --sparse https://github.com/dhis2/cli.git --branch docs-improve .cli-repo-temp'
    )

    // Navigate to the cloned repository
    process.chdir('.cli-repo-temp')

    // fs.mkdirSync('docs')
    // Set up sparse checkout to retrieve only the 'docs' directory
    execSync('git sparse-checkout init')
    execSync('git sparse-checkout set docs')

    process.chdir('..')
    // Remove any previous copy
    fs.removeSync('./docs/cli')

    // Copy the directory to another place and create missing directories
    fs.copySync('.cli-repo-temp/docs', './docs/cli', { recursive: true })

    // Remove the checked out code
    fs.removeSync('.cli-repo-temp')
} catch (error) {
    console.error(error)
}
