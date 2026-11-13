import { useDoc } from '@docusaurus/plugin-content-docs/client'
import Metadata from '@theme-original/DocItem/Metadata'
import React from 'react'
import { MarkdownAlternateLink } from '../../../plugins/llms/MarkdownAlternateLink.js'

export default function MetadataWrapper(props) {
    const { metadata } = useDoc()
    return (
        <>
            <Metadata {...props} />
            <MarkdownAlternateLink permalink={metadata.permalink} />
        </>
    )
}
