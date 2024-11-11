const sideBarReferences = require('./sidebarsReferences.js')
const sidebarMobile = require('./sidebarsMobile.js')

module.exports = {
    references: sideBarReferences.references,
    docs: [
        {
            type: 'html',
            value: '<strong>Guides & Tutorials</strong>',
            defaultStyle: true,
        },

        { id: 'overview', label: 'Overview', type: 'doc' },
        'quickstart',
        'quickstart/quickstart-web',
        'quickstart/quickstart-android',
        {
            Tutorials: [
                'tutorials',
                'tutorials/setup-env',
                'tutorials/dhis2-docker',
                'tutorials/ui-library',
                {
                    'DHIS2 App Runtime': [
                        'tutorials/app-runtime-query',
                        'tutorials/app-runtime-mutation',
                    ],
                },
            ],
        },
        {
            Guides: [
                'guides',
                {
                    'Local Development': [
                        'guides/spin-up-local-instance',
                        'guides/code-style',
                        'guides/debug-instance',
                    ],
                    'UI Library': ['guides/ui-table'],
                    'DHIS2 App Runtime': ['guides/query-playground'],
                    'App Hub': [
                        'guides/submit-apphub',
                        'guides/apphub-guidelines',
                        'guides/publish-apphub',
                    ],
                    Translation: ['guides/translation-support'],
                },
            ],
        },
        'dev-videos',
        {
            Conceptual: [
                'conceptual',
                'conceptual/git-workflow',
                'conceptual/jira-workflow',
            ],
        },
        {},
        {
            type: 'html',
            value: '<strong>Mobile Development</strong>',
            defaultStyle: true,
        },
        sidebarMobile.mobile,
    ],
}
