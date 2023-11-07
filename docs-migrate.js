const { execSync } = require('child_process')
const fs = require('fs-extra')

const migrateDocs = ({
    repo,
    branch = 'master',
    tempDir,
    targetDir,
    extraFiles = [],
    postDownloadActions = [],
}) => {
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

        postDownloadActions.forEach((action) => {
            console.log(`executing post download action: ${action}`)
            execSync(action)
        })

        process.chdir('..')

        // Remove any previous copy
        console.log(`removing previous copy at ${targetDir}`)
        fs.removeSync(targetDir)

        // Copy the directory to another place and create missing directories
        console.log(`copy files to ${targetDir}`)
        fs.copySync(`${tempDir}/docs`, targetDir, { recursive: true })

        // Copy extra files
        extraFiles.forEach((file) => {
            console.log(`copying ${file.from} to ${file.to}`)
            fs.copySync(`${tempDir}/${file.from}`, `${targetDir}/${file.to}`, {
                recursive: true,
            })
        })

        // Remove the checked out code
        console.log(`removing temp directory ${tempDir}`)
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
    repo: 'https://github.com/dhis2/cli-style.git',
    branch: 'docs-improve',
    tempDir: '.clistyle-repo-temp',
    targetDir: './docs/cli/style',
    extraFiles: [
        {
            from: 'CHANGELOG.md',
            to: 'changelog.md',
        },
        { from: 'dist/markdown/api.md', to: 'api.md' },
    ],
    postDownloadActions: [
        'git sparse-checkout set src docs',
        'yarn',
        'yarn build:docs',
    ],
})

migrateDocs({
    repo: 'https://github.com/dhis2/app-platform.git',
    tempDir: '.ap-repo-temp',
    targetDir: './docs/app-platform',
    extraFiles: [
        {
            from: 'CHANGELOG.md',
            to: 'changelog.md',
        },
    ],
})

migrateDocs({
    repo: 'https://github.com/dhis2/cli-utils-cypress.git',
    branch: 'docs-improve',
    tempDir: '.cypress-repo-temp',
    targetDir: './docs/cli/cypress',
    extraFiles: [
        {
            from: 'CHANGELOG.md',
            to: 'changelog.md',
        },
    ],
})

migrateDocs({
    repo: 'https://github.com/dhis2/app-runtime.git',
    branch: 'docs-improve',
    tempDir: '.ar-repo-temp',
    targetDir: './docs/app-runtime',
    extraFiles: [
        {
            from: 'CHANGELOG.md',
            to: 'changelog.md',
        },
    ],
})
