module.exports = {
    events: [
        'support',
        'newsletter',
        {
            type: 'category',
            label: 'Spotlight',
            link: { id: 'spotlight/about', type: 'doc' },
            items: ['spotlight/hisp-wca-report-builder'],
        },
        'stay-connected',
        'meetups',
        {
            type: 'category',
            label: 'Contributing',
            items: ['contribute-dev-portal', 'contribute'],
        },
    ],
}
