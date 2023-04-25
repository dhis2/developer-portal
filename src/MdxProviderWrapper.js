// src/MdxProviderWrapper.js
import React from 'react'
import { MDXProvider } from '@mdx-js/react'
import GridBlock from './GridBlock'
import GridBlockContainer from './GridBlockContainer'

const components = {
    GridBlock,
    GridBlockContainer,
}

const MdxProviderWrapper = ({ children }) => {
    return <MDXProvider components={components}>{children}</MDXProvider>
}

export default MdxProviderWrapper
