import React from 'react'
import styles from './GridBlock.module.css'

function GridBlock({ image, title, description, url }) {
    return (
        <div className={styles.container}>
            <a href={url}>
                <img src={image} alt={title} />
                <h3>{title}</h3>
                <p>{description}</p>
            </a>
        </div>
    )
}

export default GridBlock
