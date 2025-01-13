const { execSync } = require('child_process')
const path = require('path')
const fs = require('fs-extra')
const migrations = require('./migrateDocsConfig.json')
const args = process.argv.slice(2)

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
    sparseCheckout = true,
}) => {
    try {
        // reset the working directory between each migration
        process.chdir(__dirname)
        // Remove any previous copy
        fs.removeSync(tempDir)

        // Clone the repository and switch to the specified branch
        const cloneCommand = `git clone ${
            !sparseCheckout ? '' : '--depth 1 --sparse'
        } ${repo} --branch ${branch} ${tempDir}`

        console.log(`cloning repository with: ${cloneCommand}`)
        execSync(cloneCommand)

        // Navigate to the cloned repository
        process.chdir(tempDir)

        if (sparseCheckout) {
            // Set up sparse checkout to retrieve only the 'docs' directory
            execSync('git sparse-checkout init')
            execSync(`git sparse-checkout add ${sourceDir}`)
        }
        postDownloadActions.forEach((action) => {
            console.log(`executing post download action: ${action}`)
            execSync(action, { stdio: 'inherit' })
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

migrations.migrations.forEach((migration) => {
    if (args.length > 0 && migration.repo.indexOf(args[0]) === -1) {
        return
    }
    migrateDocs(migration)
})
