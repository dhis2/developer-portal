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
                        'cli/cli/commands/d2-utils-release',
                    ],
                },
            ],
            Cypress: [
                {
                    id: 'cli/cypress/getting-started',
                    type: 'doc',
                    label: 'Getting Started',
                },
                'cli/cypress/upgrade-guide',
                {
                    Guides: [
                        'cli/cypress/guides/setting-up-cli-tool',
                        'cli/cypress/guides/enable-auto-login',
                        'cli/cypress/guides/using-cucumber',
                        'cli/cypress/guides/using-the-network-shim',
                        'cli/cypress/guides/cross-site-cookies',
                        'cli/cypress/guides/custom-data-test-syntax',
                        'cli/cypress/guides/add-login-credentials',
                    ],
                    'API: Commands': [
                        'cli/cypress/commands/getWithDataTest',
                        'cli/cypress/commands/findWithDataTest',
                        'cli/cypress/commands/fillInLoginForm',
                        'cli/cypress/commands/all',
                    ],
                    'API: Helper Functions': [
                        'cli/cypress/helpers',
                        'cli/cypress/helpers/dataTestNameToSelector',
                        'cli/cypress/helpers/parseSelectorWithDataTest',
                    ],
                    'API: Setup': ['cli/cypress/setups/enable-auto-login'],
                    'Developer Docs': [
                        'cli/cypress/developer',
                        'cli/cypress/developer/install',
                        'cli/cypress/developer/network-shim',
                        'cli/cypress/developer/troubleshooting',
                    ],
                },
                {
                    id: 'cli/cypress/CHANGELOG',
                    label: 'Changelog',
                    type: 'doc',
                },
            ],
            'Application Platform': [
                'cli/app-platform/getting-started',
                'cli/app-platform/installation',
                'cli/app-platform/bootstrapping',
                {
                    'CLI Scripts': [
                        {
                            id: 'cli/app-platform/scripts',
                            label: 'Overview',
                            type: 'doc',
                        },
                        {
                            id: 'cli/app-platform/scripts/build',
                            label: 'build',
                            type: 'doc',
                        },
                        {
                            id: 'cli/app-platform/scripts/deploy',
                            label: 'deploy',
                            type: 'doc',
                        },
                        {
                            id: 'cli/app-platform/scripts/init',
                            label: 'init',
                            type: 'doc',
                        },
                        {
                            id: 'cli/app-platform/scripts/pack',
                            label: 'pack',
                            type: 'doc',
                        },
                        {
                            id: 'cli/app-platform/scripts/publish',
                            label: 'publish',
                            type: 'doc',
                        },
                        {
                            id: 'cli/app-platform/scripts/start',
                            label: 'start',
                            type: 'doc',
                        },
                        {
                            id: 'cli/app-platform/scripts/test',
                            label: 'test',
                            type: 'doc',
                        },
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
                {
                    id: 'cli/app-platform/CHANGELOG',
                    label: 'Changelog',
                    type: 'doc',
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
