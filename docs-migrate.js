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
    removeFiles = [],
    ignoreDirs = [],
    processMarkdown = false,
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

        if (processMarkdown) {
            console.log(`Processing markdown files in ${sourceDir}`)
            processUIMarkdownFiles(path.join(tempDir, sourceDir))
        }

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

        removeFiles.forEach((file) => {
            console.log(`removing file(s) post copy: ${file}`)
            fs.removeSync(`${tempDir}/${file}`)
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
const processUIMarkdownFiles = (directory) => {
    const files = fs.readdirSync(directory)

    files.forEach((file) => {
        const filePath = path.join(directory, file)

        if (fs.statSync(filePath).isDirectory()) {
            processUIMarkdownFiles(filePath) // Recurse into subdirectories
        } else if (file.endsWith('.md')) {
            let content = fs.readFileSync(filePath, 'utf-8')

            // Find the import line that matches 'import API from ...'
            const importRegex = /import API from ['"]([^'"]*)['"]/
            const importMatch = content.match(importRegex)

            if (importMatch) {
                const apiFilePath = path.resolve(directory, importMatch[1])
                if (fs.existsSync(apiFilePath)) {
                    const apiContent = fs.readFileSync(apiFilePath, 'utf-8')

                    // Replace the <API /> placeholder with the content from the API file
                    content = content.replace(importMatch[0], '') // Remove import line
                    content = content.replace('<API />', apiContent) // Replace placeholder

                    fs.writeFileSync(filePath, content, 'utf-8')
                    console.log(`Processed ${filePath}`)
                } else {
                    console.error(`API file not found: ${apiFilePath}`)
                }
            }

            // Find and update image paths that start with '/images/' and append '/ui/' in front
            const imageRegex = /!\[([^\]]*)\]\((\/images\/[^)]*\.png)\)/g
            content = content.replace(
                imageRegex,
                (match, altText, imagePath) => {
                    const newImagePath = `/ui${imagePath}` // Append /ui/ to image path
                    return `![${altText}](${newImagePath})`
                }
            )

            fs.writeFileSync(filePath, content, 'utf-8')
            console.log(`Processed ${filePath}`)
        }
    })
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
        'git sparse-checkout add src docs',
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
    targetDir: './ui',
    sourceDir: 'docs/docs',
    extraFiles: [
        {
            from: 'docs/src/components',
            to: '../../src/components',
        },
        {
            from: 'docs/static',
            to: '../../static/ui',
        },
        {
            from: 'CHANGELOG.md',
            to: 'package/changelog.md',
        },
        {
            from: 'docs/docs/components',
            to: '../docs/ui/components',
        },
    ],
    processMarkdown: true,
    postDownloadActions: ['git sparse-checkout add components docs'],
    removeFiles: ['../ui/components'],
    branch: 'devrel-18-prepare',
})

migrateDocs({
    repo: 'https://github.com/dhis2/dhis2-mobile-ui.git',
    tempDir: '.mui-repo-temp',
    targetDir: './mobile/mobile-ui',
    branch: 'main',
    sourceDir: 'docs',
})
