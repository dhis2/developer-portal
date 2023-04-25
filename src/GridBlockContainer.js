// src/GridBlockContainer.js
import React from 'react'

const GridBlockContainer = ({ children }) => {
    return (
        <div
            style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
            }}
        >
            {children}
        </div>
    )
}

export default GridBlockContainer
