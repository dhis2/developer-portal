import { useBlogPost } from '@docusaurus/plugin-content-blog/client'
import Metadata from '@theme-original/BlogPostPage/Metadata'
import React from 'react'
import { MarkdownAlternateLink } from '../../../plugins/llms/MarkdownAlternateLink.js'

export default function MetadataWrapper(props) {
    const { metadata } = useBlogPost()
    return (
        <>
            <Metadata {...props} />
            <MarkdownAlternateLink permalink={metadata.permalink} />
        </>
    )
}
