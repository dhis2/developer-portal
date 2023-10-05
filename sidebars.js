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
                    'd2 cluster': [
                        'cli/cli/commands/d2-cluster',
                        'cli/cli/recipes/stable-version',
                        'cli/cli/recipes/development-version',
                        'cli/cli/recipes/custom-dhis-config',
                        'cli/cli/recipes/custom-docker-image',
                    ],
                    'd2 utils': ['cli/cli/commands/d2-utils-release'],
                },
            ],
            'Application Platform': [
                'cli/app-platform/getting-started',
                'cli/app-platform/installation',
                'cli/app-platform/bootstrapping',
                {
                    'CLI Scripts': [
                        'cli/app-platform/scripts',
                        'cli/app-platform/scripts/build',
                        'cli/app-platform/scripts/deploy',
                        'cli/app-platform/scripts/init',
                        'cli/app-platform/scripts/pack',
                        'cli/app-platform/scripts/publish',
                        'cli/app-platform/scripts/start',
                        'cli/app-platform/scripts/test',
                    ],
                },
                {
                    Configuration: [
                        'cli/app-platform/config/types',
                        'cli/app-platform/config/d2-config-js-reference',
                        'cli/app-platform/config/environment',
                    ],
                },
                {
                    Usage: [
                        'cli/app-platform/usage/dependencies',
                        'cli/app-platform/usage/css',
                        'cli/app-platform/usage/static-files',
                        'cli/app-platform/usage/app-icon',
                    ],
                },
                'cli/app-platform/pwa/pwa',
                'cli/app-platform/architecture',
                'cli/app-platform/troubleshooting',
                'cli/app-platform/proxy',
                'cli/app-platform/CHANGELOG',
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
