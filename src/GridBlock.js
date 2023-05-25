import React from 'react'
import styles from './GridBlock.module.css'

// small component for displaying small blocks of content in a grid GridBlockContainer
const GridBlock = ({ image, title, description, url }) => {
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

const FullWidthComponent = ({ title, description, url, image }) => {
    return (
        <div className={styles.fullWidthContainer}>
            {image && <img src={image} alt={title} className={styles.image} />}
            <a href={url} target="_blank" rel="noopener noreferrer">
                <h3 className={styles.title}>{title}</h3>
                <p className={styles.description}>{description}</p>
                <p className={styles.url}>{url}</p>
            </a>
        </div>
    )
}

export default GridBlock
export { FullWidthComponent }
