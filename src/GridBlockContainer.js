// src/GridBlockContainer.js
import React from 'react'

const GridBlockContainer = ({ children }) => {
    return (
        <div
            style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'left',
            }}
        >
            {children}
        </div>
    )
}

export default GridBlockContainer
