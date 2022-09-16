module.exports = {
    docs: [
        {
            'Quick Start': [
                'quickstart',
                'quickstart/quickstart-web',
                'quickstart/quickstart-android',
            ],
        },
        {
            Tutorials: [
                'tutorials',
                'tutorials/setup-env',
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
        'reference',
        {
            Conceptual: [
                'conceptual',
                'conceptual/git-workflow',
                'conceptual/jira-workflow',
            ],
        },
        {
            'Application Platform': [
                'platform/getting-started',
                'platform/installation',
                'platform/bootstrapping',
                {
                    Scripts: [
                        'platform/scripts',
                        'platform/scripts/init',
                        'platform/scripts/build',
                        'platform/scripts/start',
                        'platform/scripts/test',
                        'platform/scripts/pack',
                        'platform/scripts/deploy',
                        'platform/scripts/publish',
                    ],
                },
                {
                    Configuration: [
                        'platform/config',
                        'platform/config/types',
                        'platform/config/d2-config-js-reference',
                        'platform/config/environment'
                    ]
                },
                {
                    Usage: [
                        'platform/usage',
                        'platform/usage/dependencies',
                        'platform/usage/css',
                        'platform/usage/static-files',
                        'platform/usage/app-icon',                                        ]
                },
                'platform/pwa/pwa',
                'platform/architecture',
                'platform/troubleshooting',
                'platform/proxy',
                'platform/CHANGELOG'
            ],
        },
    ],
}
