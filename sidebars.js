module.exports = {
    docs: [
        {'Quick Start': [
            'quickstart',
            'quickstart/quickstart-web',
            'quickstart/quickstart-android',
        ]},
        {Tutorials: [
            'tutorials',
            'tutorials/setup-env',
            'tutorials/ui-library',
            {
                'DHIS2 App Runtime': [
                    'tutorials/app-runtime-query',
                    'tutorials/app-runtime-mutation',
                ],
            },
        ]},
        {Guides: [
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
        ]},
        'dev-videos',
        'reference',
        {Conceptual: ['conceptual', 'conceptual/git-workflow', 'conceptual/jira-workflow']},
    ],
}
