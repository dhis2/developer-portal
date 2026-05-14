import React, { useEffect, useRef, useState } from 'react'

export default function DiscourseEmbed({
    discourseUrl = 'https://community.dhis2.org',
    category,
    tags,
    perPage = 5,
    template = 'complete',
    loading,
}) {
    const containerRef = useRef(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const handleMessage = (e) => {
            if (e?.data?.type === 'discourse-resize' && e.data.embedId) {
                const iframe = document.getElementById(e.data.embedId)
                if (iframe) iframe.style.height = e.data.height + 'px'
            }
        }

        window.addEventListener('message', handleMessage, false)

        // II. Iframe Injection Logic
        if (
            containerRef.current &&
            containerRef.current.querySelector('iframe') === null
        ) {
            const frameId = 'de-' + Math.random().toString(36).substr(2, 9)
            const params = new URLSearchParams({
                discourse_embed_id: frameId,
                category,
                tags,
                per_page: perPage,
                template,
            })

            const iframe = document.createElement('iframe')
            iframe.src = `${discourseUrl}/embed/topics?${params.toString()}`
            iframe.id = frameId
            iframe.frameBorder = '0'
            iframe.scrolling = 'no'
            iframe.style.width = '100%'
            iframe.style.height = '600px'
            iframe.style.border = '0'
            iframe.style.width = '100%'
            iframe.style.visibility = 'hidden' // Keep hidden until loaded

            // III. The "OnLoad" Handover
            iframe.onload = () => {
                setIsLoading(false)
                iframe.style.visibility = 'visible'
            }

            containerRef.current.appendChild(iframe)
        }

        return () => window.removeEventListener('message', handleMessage, false)
    }, [discourseUrl, category, tags, perPage, template])

    return (
        <div
            className="discourse-embed-wrapper"
            style={{ minHeight: '100px', position: 'relative' }}
        >
            {isLoading && (
                <div
                    className="discourse-loading-state"
                    style={{
                        padding: '20px',
                        color: 'var(--ifm-color-primary)',
                        fontWeight: 'bold',
                        fontStyle: 'italic',
                    }}
                >
                    {loading || `Loading Developer Meetups' topics...`}
                </div>
            )}
            <div ref={containerRef} className="discourse-topics-container" />
        </div>
    )
}
