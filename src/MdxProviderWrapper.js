// src/MdxProviderWrapper.js
import React from 'react'
import { MDXProvider } from '@mdx-js/react'
import GridBlock, { FullWidthComponent } from './GridBlock'
import GridBlockContainer from './GridBlockContainer'

const components = {
    GridBlock,
    GridBlockContainer,
    FullWidthComponent,
}

const MdxProviderWrapper = ({ children }) => {
    return <MDXProvider components={components}>{children}</MDXProvider>
}

export default MdxProviderWrapper
