/**
 * Converts Docusaurus Markdown/MDX source into plain Markdown that is
 * easier for LLMs to consume: strips front matter, MDX imports/exports,
 * React components and MDX comments, and rewrites links to absolute URLs.
 *
 * Content inside fenced code blocks is never modified.
 */
const path = require('path')

const FENCE_RE = /^\s*(`{3,}|~{3,})/
const FRONT_MATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/

const splitFrontMatter = (raw) => {
    const match = raw.match(FRONT_MATTER_RE)
    if (!match) {
        return { body: raw }
    }
    return { body: raw.slice(match[0].length) }
}

const getAttr = (tag, name) => {
    const match = tag.match(
        new RegExp(`${name}=(?:"([^"]*)"|'([^']*)'|{["'\`]([^"'\`]*)["'\`]})`)
    )
    return match ? match[1] ?? match[2] ?? match[3] : undefined
}

const demoToLink = (tag, siteUrl) => {
    const storyPath = (getAttr(tag, 'path') || '').replace('/story/', '')
    if (!storyPath) {
        return ''
    }
    return `[Interactive demo: ${storyPath}](${siteUrl}/demo/?path=/story/${encodeURIComponent(
        storyPath
    )})`
}

/**
 * Transforms a single line that is outside of a code fence.
 * Returns null when the line should be dropped.
 */
const transformLine = (line, siteUrl) => {
    const trimmed = line.trim()

    // MDX ESM: import ... from '...' / import '...'
    if (/^import\s+(.+\s+from\s+)?['"][^'"]+['"];?$/.test(trimmed)) {
        return null
    }

    // Blog excerpt marker
    if (/^(<!--\s*truncate\s*-->|{\/\*\s*truncate\s*\*\/})$/.test(trimmed)) {
        return null
    }

    // MDX comments
    let out = line.replace(/{\/\*[\s\S]*?\*\/}/g, '')
    if (line.trim() && !out.trim()) {
        return null
    }

    // <Demo ... /> -> link to the storybook demo
    out = out.replace(/<Demo\b[^>]*\/>/g, (tag) => demoToLink(tag, siteUrl))

    // <TabItem label="X"> -> bold label (de-indented, so it isn't read as a code block)
    if (/^<TabItem\b[^>]*>$/.test(out.trim())) {
        const tag = out.trim()
        const label = getAttr(tag, 'label') || getAttr(tag, 'value')
        return label ? `\n**${label}**\n` : null
    }
    out = out.replace(/<TabItem\b[^>]*>/g, (tag) => {
        const label = getAttr(tag, 'label') || getAttr(tag, 'value')
        return label ? `**${label}**\n` : ''
    })
    out = out.replace(/<\/TabItem>|<Tabs\b[^>]*>|<\/Tabs>/g, '')

    // Lines that are entirely a React component tag (capitalised name).
    // Inline mentions inside prose are left alone.
    if (/^<\/?[A-Z][\w.]*(\s[^>]*)?\/?>$/.test(out.trim())) {
        return null
    }

    if (line.trim() && !out.trim()) {
        return null
    }
    return out
}

const rewriteLinks = (
    markdown,
    { sourceFile, siteDir, siteUrl, resolveDoc }
) => {
    // Matches markdown links and images: [text](url) / ![alt](url).
    // Link text may span multiple lines.
    return markdown.replace(
        /(!?)\[([^\]]*)\]\(([^)\s]+)(\s+"[^"]*")?\)/g,
        (match, bang, text, url, title = '') => {
            if (/^(https?:|mailto:|#|data:)/.test(url)) {
                return match
            }

            const [urlPath, hash = ''] = url.split('#')
            const anchor = hash ? `#${hash}` : ''

            // Links to other markdown files: point to their generated .md URL
            if (!bang && /\.mdx?$/.test(urlPath)) {
                const target = urlPath.startsWith('/')
                    ? path.join(siteDir, urlPath)
                    : path.resolve(path.dirname(sourceFile), urlPath)
                const doc = resolveDoc(decodeURI(target))
                if (doc) {
                    return `[${text}](${siteUrl}${doc.mdPath}${anchor})${title}`
                }
            }

            if (urlPath.startsWith('/')) {
                return `${bang}[${text}](${siteUrl}${urlPath}${anchor})${title}`
            }

            return match
        }
    )
}

const isFenceClose = (fenceMatch, fence) =>
    fenceMatch &&
    fenceMatch[1][0] === fence[0] &&
    fenceMatch[1].length >= fence.length

// A line that opens a component tag (<Demo ..., <TabItem ...) without closing it
const OPEN_TAG_RE = /^\s*<[A-Z][\w.]*(\s[^>]*)?$/

const mdxToMarkdown = (
    raw,
    { title, sourceFile, siteDir, siteUrl, resolveDoc }
) => {
    const { body } = splitFrontMatter(raw)
    const lines = body.split(/\r?\n/)
    // Chunks of consecutive lines, either code (left untouched) or prose
    const chunks = []
    const push = (line, isCode) => {
        const last = chunks[chunks.length - 1]
        if (last && last.isCode === isCode) {
            last.lines.push(line)
        } else {
            chunks.push({ isCode, lines: [line] })
        }
    }

    let fence = null
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i]
        const fenceMatch = line.match(FENCE_RE)
        if (fence) {
            push(line, true)
            if (isFenceClose(fenceMatch, fence)) {
                fence = null
            }
            continue
        }
        if (fenceMatch) {
            fence = fenceMatch[1]
            push(line, true)
            continue
        }
        // Join component tags whose attributes span several lines
        if (OPEN_TAG_RE.test(line)) {
            let j = i
            let joined = line
            while (j + 1 < lines.length && !joined.includes('>')) {
                j++
                joined += ` ${lines[j].trim()}`
            }
            if (joined.includes('>')) {
                line = joined
                i = j
            }
        }
        const transformed = transformLine(line, siteUrl)
        if (transformed !== null) {
            push(transformed, false)
        }
    }

    let markdown = chunks
        .map(({ isCode, lines: chunkLines }) => {
            const text = chunkLines.join('\n')
            return isCode
                ? text
                : rewriteLinks(text, {
                      sourceFile,
                      siteDir,
                      siteUrl,
                      resolveDoc,
                  })
        })
        .join('\n')
        .replace(/\n{3,}/g, '\n\n')
        .trim()

    const firstLine = markdown.split('\n').find((l) => l.trim()) || ''
    if (title && !/^#\s/.test(firstLine)) {
        markdown = `# ${title}\n\n${markdown}`
    }

    return markdown
}

module.exports = { mdxToMarkdown }
