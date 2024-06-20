import clsx from 'clsx'
import {
    HtmlClassNameProvider,
    ThemeClassNames,
} from '@docusaurus/theme-common'
import {
    BlogPostProvider,
    useBlogPost,
} from '@docusaurus/theme-common/internal'
import BlogLayout from '@theme/BlogLayout'
import BlogPostItem from '@theme/BlogPostItem'
import BlogPostPaginator from '@theme/BlogPostPaginator'
import BlogPostPageMetadata from '@theme/BlogPostPage/Metadata'
import TOC from '@theme/TOC'

/** This is a swizzled (https://docusaurus.io/docs/swizzling) component
 * Swizzling is docusaurus's term for overriding a component
 * This is done to inject the GitHub comment-system (https://utteranc.es)
 */
function BlogPostPageContent({ sidebar, children }) {
    useEffect(() => {
        const script = document.createElement('script')

        script.src = 'https://utteranc.es/client.js'
        script.setAttribute('repo', 'dhis2/developer-portal')
        script.setAttribute('issue-term', 'pathname')
        script.setAttribute('label', 'comment')
        script.setAttribute('theme', 'github-light')
        script.crossOrigin = 'anonymous'
        script.async = true

        document.getElementById('comment-system').appendChild(script)
    }, [])

    const { metadata, toc } = useBlogPost()
    const { nextItem, prevItem, frontMatter } = metadata
    const {
        hide_table_of_contents: hideTableOfContents,
        toc_min_heading_level: tocMinHeadingLevel,
        toc_max_heading_level: tocMaxHeadingLevel,
    } = frontMatter
    return (
        <BlogLayout
            sidebar={sidebar}
            toc={
                !hideTableOfContents && toc.length > 0 ? (
                    <TOC
                        toc={toc}
                        minHeadingLevel={tocMinHeadingLevel}
                        maxHeadingLevel={tocMaxHeadingLevel}
                    />
                ) : undefined
            }
        >
            <BlogPostItem>{children}</BlogPostItem>
            {/** Inject GitHub comment system */}
            <div id="comment-system"></div>
            {(nextItem || prevItem) && (
                <BlogPostPaginator nextItem={nextItem} prevItem={prevItem} />
            )}
        </BlogLayout>
    )
}

export default function BlogPostPage(props) {
    const BlogPostContent = props.content
    return (
        <BlogPostProvider content={props.content} isBlogPostPage>
            <HtmlClassNameProvider
                className={clsx(
                    ThemeClassNames.wrapper.blogPages,
                    ThemeClassNames.page.blogPostPage
                )}
            >
                <BlogPostPageMetadata />
                <BlogPostPageContent sidebar={props.sidebar}>
                    <BlogPostContent />
                </BlogPostPageContent>
            </HtmlClassNameProvider>
        </BlogPostProvider>
    )
}
