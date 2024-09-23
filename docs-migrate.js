const { execSync } = require('child_process')
const path = require('path')
const fs = require('fs-extra')

const migrateDocs = ({
    repo,
    branch = 'master',
    sourceDir = 'docs',
    tempDir,
    targetDir,
    extraFiles = [],
    postDownloadActions = [],
    ignoreDirs = [],
}) => {
    try {
        // reset the working directory between each migration
        process.chdir(__dirname)
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
        execSync(`git sparse-checkout add ${sourceDir}`)

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
        fs.copySync(`${tempDir}/${sourceDir}`, targetDir, {
            recursive: true,
            filter: (src) =>
                !ignoreDirs.some((dir) =>
                    src.includes(path.join(tempDir, sourceDir, dir))
                ),
        })

        // Copy extra files
        extraFiles.forEach((file) => {
            console.log(`copying ${file.from} to ${file.to}`)
            if (file.from.indexOf('CHANGELOG') !== -1) {
                replaceEmailsWithBackticks(`${tempDir}/${file.from}`)
            }
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

function replaceEmailsWithBackticks(filePath) {
    const content = fs.readFileSync(filePath, 'utf8')
    const updatedContent = content.replace(
        /<([^<>@]+@[^<>@]+\.[^<>@]+)>/g,
        '`$1`'
    )
    fs.writeFileSync(filePath, updatedContent, 'utf8')
}

migrateDocs({
    repo: 'https://github.com/dhis2/cli.git',
    tempDir: '.cli-repo-temp',
    targetDir: './docs/cli/cli',
})

migrateDocs({
    repo: 'https://github.com/dhis2/cli-style.git',
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
        'yarn build:jsdoc',
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
    tempDir: '.ar-repo-temp',
    targetDir: './docs/app-runtime',
    extraFiles: [
        {
            from: 'CHANGELOG.md',
            to: 'changelog.md',
        },
    ],
})

migrateDocs({
    repo: 'https://github.com/dhis2/capture-app.git',
    tempDir: '.capture-repo-temp',
    targetDir: './docs/capture-plugins',
    ignoreDirs: ['user'],
})

migrateDocs({
    repo: 'https://github.com/dhis2/ui.git',
    tempDir: '.ui-repo-temp',
    targetDir: './docs/ui',
    sourceDir: 'docs/docs',
})
