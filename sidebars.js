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
            CLI: [
                'cli/readme',
                'cli/cli/commands/d2-overview',
                {
                    'd2 Cluster': [
                        'cli/cli/commands/d2-cluster',
                        'cli/cli/commands/d2-utils-release',
                        'cli/cli/recipes/custom-dhis-config',
                        'cli/cli/recipes/custom-docker-image',
                        'cli/cli/recipes/development-version',
                        'cli/cli/recipes/stable-version',
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
    ],
}
