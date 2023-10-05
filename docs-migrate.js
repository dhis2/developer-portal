const { execSync } = require('child_process')
const fs = require('fs-extra')

const migrateDocs = ({ repo, branch = 'master', tempDir, targetDir }) => {
    try {
        // Remove any previous copy
        fs.removeSync(tempDir)

        // Clone the repository and switch to the specified branch
        execSync(
            `git clone --depth 1 --sparse ${repo} --branch ${branch} ${tempDir}`
        )

        // Navigate to the cloned repository
        process.chdir(tempDir)

        // Set up sparse checkout to retrieve only the 'docs' directory
        execSync('git sparse-checkout init')
        execSync('git sparse-checkout set docs')

        process.chdir('..')

        // Remove any previous copy
        fs.removeSync(targetDir)

        // Copy the directory to another place and create missing directories
        fs.copySync(`${tempDir}/docs`, targetDir, { recursive: true })

        // Remove the checked out code
        fs.removeSync(tempDir)
    } catch (error) {
        console.error(error)
    }
}

migrateDocs({
    repo: 'https://github.com/dhis2/cli.git',
    branch: 'docs-improve',
    tempDir: '.cli-repo-temp',
    targetDir: './docs/cli/cli',
})

migrateDocs({
    repo: 'https://github.com/dhis2/app-platform.git',
    branch: 'docs-improve',
    tempDir: '.ap-repo-temp',
    targetDir: './docs/cli/app-platform',
})
