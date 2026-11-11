/**
 * Generates LLM-friendly output at build time:
 *
 * - /llms.txt                 curated index of the site (https://llmstxt.org)
 * - /llms-full.txt            all docs pages concatenated as Markdown
 * - /llms-full-<area>.txt     the same, split per area of the site
 * - /<permalink>.md           a clean Markdown version of every docs page and blog post
 * - <link rel="alternate" type="text/markdown"> in each page's HTML pointing to its .md
 *
 * Page metadata (permalinks, titles, descriptions, sidebars) comes from the
 * Docusaurus content plugins, so custom slugs and route base paths are respected.
 */
const path = require('path')
const fs = require('fs-extra')
const { mdxToMarkdown } = require('./mdxToMarkdown.js')

const DOCS_PLUGIN = 'docusaurus-plugin-content-docs'
const BLOG_PLUGIN = 'docusaurus-plugin-content-blog'

// Recent blog posts are listed in the main Blog section, older ones under Optional
const RECENT_BLOG_YEARS = 2

const slugify = (text) =>
    text
        .toLowerCase()
        .replace(/&/g, 'and')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')

const toMdPath = (permalink) =>
    permalink.endsWith('/') ? `${permalink}index.md` : `${permalink}.md`

const cleanDescription = (description = '') =>
    description
        .replace(/\s+/g, ' ')
        .replace(/<\/?[A-Za-z][^>]*(>|$)/g, '')
        .trim()
        .slice(0, 200)

const isChangelog = (page) => /changelog/i.test(page.permalink)

/** Walks a processed sidebar and groups doc ids into sections, in sidebar order. */
const collectSidebarSections = (sidebar, sidebarTitle) => {
    const sections = []
    const getSection = (title) => {
        let section = sections.find((s) => s.title === title)
        if (!section) {
            section = { title, docIds: [] }
            sections.push(section)
        }
        return section
    }

    const walk = (items, sectionTitle) => {
        for (const item of items) {
            if (item.type === 'doc' || item.type === 'ref') {
                getSection(sectionTitle).docIds.push(item.id)
            } else if (item.type === 'category') {
                if (item.link?.type === 'doc') {
                    getSection(sectionTitle).docIds.push(item.link.id)
                }
                walk(item.items, sectionTitle)
            }
        }
    }

    for (const item of sidebar) {
        if (item.type === 'category') {
            const title = `${sidebarTitle}: ${item.label}`
            if (item.link?.type === 'doc') {
                getSection(title).docIds.push(item.link.id)
            }
            walk(item.items, title)
        } else {
            walk([item], sidebarTitle)
        }
    }
    return sections
}

module.exports = function llmsPlugin(context, options) {
    const { siteDir, siteConfig } = context
    const siteUrl = siteConfig.url.replace(/\/$/, '')
    const {
        title = siteConfig.title,
        summary = siteConfig.tagline,
        details = '',
        // { [docsPluginId]: { title, sidebars: { [sidebarId]: title } } }
        docsAreas = {},
        blogTitle = 'Blog',
        // Areas (sidebar titles) that additionally get one bundle per top-level category
        splitAreas = [],
    } = options

    let pages = []
    let sections = []

    return {
        name: 'llms-plugin',

        async allContentLoaded({ allContent }) {
            pages = []
            sections = []
            const optional = { title: 'Optional', pages: [] }

            const addPage = (page) => {
                pages.push(page)
                return page
            }

            // Docs (all instances, in configured order)
            const docsContent = allContent[DOCS_PLUGIN] || {}
            const pluginIds = [
                ...Object.keys(docsAreas),
                ...Object.keys(docsContent).filter((id) => !docsAreas[id]),
            ].filter((id) => docsContent[id])

            for (const pluginId of pluginIds) {
                const area = docsAreas[pluginId] || { title: pluginId }
                const version = docsContent[pluginId].loadedVersions[0]
                const docsById = new Map()
                for (const doc of version.docs) {
                    if (doc.frontMatter?.draft || doc.unlisted) {
                        continue
                    }
                    docsById.set(
                        doc.id,
                        addPage({
                            title: doc.title,
                            description: cleanDescription(doc.description),
                            permalink: doc.permalink,
                            mdPath: toMdPath(doc.permalink),
                            source: path.join(
                                siteDir,
                                doc.source.replace(/^@site\//, '')
                            ),
                            editUrl: doc.editUrl || undefined,
                            isDoc: true,
                        })
                    )
                }

                const used = new Set()
                const sidebarIds = Object.keys(version.sidebars)
                const orderedSidebarIds = [
                    ...Object.keys(area.sidebars || {}),
                    ...sidebarIds.filter((id) => !area.sidebars?.[id]),
                ].filter((id) => version.sidebars[id])

                for (const sidebarId of orderedSidebarIds) {
                    const sidebarTitle =
                        area.sidebars?.[sidebarId] || area.title
                    for (const section of collectSidebarSections(
                        version.sidebars[sidebarId],
                        sidebarTitle
                    )) {
                        const sectionPages = []
                        for (const id of section.docIds) {
                            const page = docsById.get(id)
                            if (!page || used.has(id)) {
                                continue
                            }
                            used.add(id)
                            if (isChangelog(page)) {
                                optional.pages.push(page)
                            } else {
                                sectionPages.push(page)
                            }
                        }
                        if (sectionPages.length) {
                            sections.push({
                                title: section.title,
                                area: sidebarTitle,
                                pages: sectionPages,
                            })
                        }
                    }
                }

                // Pages that are not in any sidebar
                const rest = [...docsById.entries()]
                    .filter(([id]) => !used.has(id))
                    .map(([, page]) => page)
                const restMain = rest.filter((p) => !isChangelog(p))
                optional.pages.push(...rest.filter(isChangelog))
                if (restMain.length) {
                    sections.push({
                        title: `${area.title}: Other pages`,
                        area: null, // only included in llms-full.txt
                        includeInFull: true,
                        pages: restMain,
                    })
                }
            }

            // Blog
            const blogContent = allContent[BLOG_PLUGIN]?.default
            if (blogContent) {
                const cutoff = new Date()
                cutoff.setFullYear(cutoff.getFullYear() - RECENT_BLOG_YEARS)
                const recent = []
                for (const { metadata } of blogContent.blogPosts) {
                    if (metadata.unlisted || metadata.frontMatter?.draft) {
                        continue
                    }
                    const page = addPage({
                        title: metadata.title,
                        description: cleanDescription(metadata.description),
                        permalink: metadata.permalink,
                        mdPath: toMdPath(metadata.permalink),
                        source: path.join(
                            siteDir,
                            metadata.source.replace(/^@site\//, '')
                        ),
                        editUrl: metadata.editUrl || undefined,
                        date: metadata.date,
                        isDoc: false,
                    })
                    if (new Date(metadata.date) >= cutoff) {
                        recent.push(page)
                    } else {
                        optional.pages.push(page)
                    }
                }
                if (recent.length) {
                    sections.push({ title: blogTitle, pages: recent })
                }
            }

            if (optional.pages.length) {
                sections.push(optional)
            }
        },

        async postBuild({ outDir }) {
            const bySource = new Map(pages.map((p) => [p.source, p]))
            const resolveDoc = (file) => bySource.get(file)

            // 1. Per-page markdown + alternate link in the HTML
            const markdownByPage = new Map()
            await Promise.all(
                pages.map(async (page) => {
                    if (!(await fs.pathExists(page.source))) {
                        return
                    }
                    const raw = await fs.readFile(page.source, 'utf8')
                    const body = mdxToMarkdown(raw, {
                        title: page.title,
                        sourceFile: page.source,
                        siteDir,
                        siteUrl,
                        resolveDoc,
                    })
                    const header = [
                        '---',
                        `title: ${JSON.stringify(page.title)}`,
                        page.description &&
                            `description: ${JSON.stringify(page.description)}`,
                        `url: ${siteUrl}${page.permalink}`,
                        page.date &&
                            `date: ${new Date(page.date)
                                .toISOString()
                                .slice(0, 10)}`,
                        page.editUrl && `source: ${page.editUrl}`,
                        '---',
                    ]
                        .filter(Boolean)
                        .join('\n')
                    const markdown = `${header}\n\n${body}\n`
                    markdownByPage.set(page, markdown)

                    await fs.outputFile(
                        path.join(outDir, page.mdPath),
                        markdown
                    )
                    await injectAlternateLink(outDir, page, siteUrl)
                })
            )

            // 2. llms.txt
            // Docs pages that go into llms-full.txt (blog and Optional excluded)
            const fullSections = sections.filter(
                (s) => s.area || s.includeInFull
            )
            // One bundle per area, plus one per section for areas in `splitAreas`
            const fullBundles = []
            for (const s of fullSections) {
                if (!s.area) {
                    continue
                }
                let areaBundle = fullBundles.find((b) => b.title === s.area)
                if (!areaBundle) {
                    areaBundle = { title: s.area, pages: [] }
                    fullBundles.push(areaBundle)
                }
                areaBundle.pages.push(...s.pages)
                if (splitAreas.includes(s.area) && s.title !== s.area) {
                    fullBundles.push({ title: s.title, pages: s.pages })
                }
            }
            for (const b of fullBundles) {
                b.file = `llms-full-${slugify(b.title)}.txt`
            }

            const llmsTxt = [
                `# ${title}`,
                '',
                `> ${summary}`,
                '',
                ...(details ? [details, ''] : []),
                'Every page listed below is available as Markdown by appending `.md` to its URL.',
                `The complete documentation is available in a single file at ${siteUrl}/llms-full.txt,`,
                'and split by area in the following files:',
                '',
                ...fullBundles.map(
                    (b) => `- [${b.title}](${siteUrl}/${b.file})`
                ),
                '',
                ...sections.flatMap((section) => [
                    `## ${section.title}`,
                    '',
                    ...section.pages.map(
                        (p) =>
                            `- [${p.title}](${siteUrl}${p.mdPath})${
                                p.description ? `: ${p.description}` : ''
                            }`
                    ),
                    '',
                ]),
            ].join('\n')
            await fs.outputFile(path.join(outDir, 'llms.txt'), llmsTxt)

            // 3. llms-full.txt and per-area bundles (docs only)
            const bundle = (bundleTitle, bundlePages) =>
                [
                    `# ${bundleTitle}`,
                    '',
                    `> ${summary}`,
                    '',
                    ...bundlePages
                        .filter((p) => markdownByPage.has(p))
                        .map((p) => markdownByPage.get(p)),
                ].join('\n')

            await fs.outputFile(
                path.join(outDir, 'llms-full.txt'),
                bundle(
                    title,
                    fullSections.flatMap((s) => s.pages)
                )
            )
            await Promise.all(
                fullBundles.map((b) =>
                    fs.outputFile(
                        path.join(outDir, b.file),
                        bundle(`${title}: ${b.title}`, b.pages)
                    )
                )
            )

            console.log(
                `[llms-plugin] wrote llms.txt, llms-full.txt, ${fullBundles.length} area bundles and ${markdownByPage.size} markdown pages`
            )
        },
    }
}

/** Adds <link rel="alternate" type="text/markdown"> to the page's generated HTML. */
async function injectAlternateLink(outDir, page, siteUrl) {
    const base = page.permalink.replace(/\/$/, '')
    const candidates = [
        path.join(outDir, base, 'index.html'),
        path.join(outDir, `${base}.html`),
    ]
    for (const file of candidates) {
        if (await fs.pathExists(file)) {
            const html = await fs.readFile(file, 'utf8')
            if (html.includes('type="text/markdown"')) {
                return
            }
            const tag = `<link rel="alternate" type="text/markdown" href="${siteUrl}${page.mdPath}">`
            await fs.writeFile(file, html.replace('</head>', `${tag}</head>`))
            return
        }
    }
}
