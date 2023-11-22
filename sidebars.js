module.exports = {
    docs: [
        { id: 'overview', label: 'Overview', type: 'doc' },
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
        {
            type: 'html',
            value: '<br /><b>References</b>',
            defaultStyle: true,
        },
        {
            label: 'Web App Development',
            type: 'category',
            collapsed: false,
            collapsible: true,
            items: [
                {
                    'Application Platform': [
                        'app-platform/getting-started',
                        'app-platform/installation',
                        'app-platform/bootstrapping',
                        {
                            'CLI Scripts': [
                                {
                                    id: 'app-platform/scripts',
                                    label: 'Overview',
                                    type: 'doc',
                                },
                                {
                                    id: 'app-platform/scripts/build',
                                    label: 'build',
                                    type: 'doc',
                                },
                                {
                                    id: 'app-platform/scripts/deploy',
                                    label: 'deploy',
                                    type: 'doc',
                                },
                                {
                                    id: 'app-platform/scripts/init',
                                    label: 'init',
                                    type: 'doc',
                                },
                                {
                                    id: 'app-platform/scripts/pack',
                                    label: 'pack',
                                    type: 'doc',
                                },
                                {
                                    id: 'app-platform/scripts/publish',
                                    label: 'publish',
                                    type: 'doc',
                                },
                                {
                                    id: 'app-platform/scripts/start',
                                    label: 'start',
                                    type: 'doc',
                                },
                                {
                                    id: 'app-platform/scripts/test',
                                    label: 'test',
                                    type: 'doc',
                                },
                            ],
                        },
                        {
                            type: 'category',
                            label: 'Configuration',
                            link: { id: 'app-platform/config', type: 'doc' },
                            items: [
                                'app-platform/config/types',
                                'app-platform/config/d2-config-js-reference',
                                'app-platform/config/environment',
                            ],
                        },
                        {
                            Usage: [
                                'app-platform/usage/dependencies',
                                'app-platform/usage/css',
                                'app-platform/usage/static-files',
                                'app-platform/usage/app-icon',
                            ],
                        },
                        'app-platform/pwa/pwa',
                        'app-platform/architecture',
                        'app-platform/troubleshooting',
                        'app-platform/proxy',
                        {
                            id: 'app-platform/changelog',
                            label: 'Changelog',
                            type: 'doc',
                        },
                    ],
                },
                {
                    'Application Runtime': [
                        'app-runtime/getting-started',
                        'app-runtime/provider',
                        {
                            Hooks: [
                                {
                                    id: 'app-runtime/hooks/README',
                                    label: 'Overview',
                                    type: 'doc',
                                },
                                'app-runtime/hooks/useConfig',
                                'app-runtime/hooks/useDataQuery',
                                'app-runtime/hooks/useDataMutation',
                                'app-runtime/hooks/useDataEngine',
                                'app-runtime/hooks/useAlert',
                                'app-runtime/hooks/useAlerts',
                                'app-runtime/hooks/useTimeZoneConversion',
                            ],
                        },
                        {
                            Components: [
                                {
                                    id: 'app-runtime/components/README',
                                    label: 'Overview',
                                    type: 'doc',
                                },
                                'app-runtime/components/DataQuery',
                                'app-runtime/components/DataMutation',
                            ],
                        },
                        {
                            Types: [
                                'app-runtime/types/Config',
                                'app-runtime/types/Query',
                                'app-runtime/types/Mutation',
                            ],
                        },
                        {
                            Advanced: [
                                {
                                    'Offline Tools': [
                                        {
                                            id: 'app-runtime/advanced/offline/README',
                                            label: 'Overview',
                                            type: 'doc',
                                        },
                                        'app-runtime/advanced/offline/CacheableSections',
                                        'app-runtime/advanced/offline/useDhis2ConnectionStatus',
                                        'app-runtime/advanced/offline/useOnlineStatus',
                                    ],
                                },
                                'app-runtime/advanced/services',
                                'app-runtime/advanced/DataEngine',
                                'app-runtime/advanced/DataEngineLinks',
                                'app-runtime/advanced/redux',
                            ],
                        },
                        {
                            href: 'https://play.dhis2.org/demo/api/apps/query-playground/index.html',
                            label: 'Query Playground',
                            type: 'link',
                        },
                        {
                            id: 'app-runtime/changelog',
                            label: 'Changelog',
                            type: 'doc',
                        },
                    ],
                },
                {
                    'd2 style': [
                        {
                            id: 'cli/style/getting-started',
                            type: 'doc',
                            label: 'Getting Started',
                        },
                        {
                            id: 'cli/style/migrate-guide',
                            type: 'doc',
                            label: 'Migration Guide',
                        },
                        {
                            Configuration: [
                                {
                                    id: 'cli/style/ignore-files',
                                    type: 'doc',
                                    label: 'Ignore Files',
                                },
                                {
                                    id: 'cli/style/overrides',
                                    type: 'doc',
                                    label: 'Configuration Overrides',
                                },
                            ],
                        },
                        { id: 'cli/style/faq', type: 'doc', label: 'FAQ' },
                        {
                            id: 'cli/style/api',
                            type: 'doc',
                            label: 'API Reference',
                        },
                        {
                            id: 'cli/style/changelog',
                            type: 'doc',
                            label: 'Changelog',
                        },
                    ],
                },
                {
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
                            'API: Setup': [
                                'cli/cypress/setups/enable-auto-login',
                            ],
                            'Developer Docs': [
                                'cli/cypress/developer',
                                'cli/cypress/developer/install',
                                'cli/cypress/developer/network-shim',
                                'cli/cypress/developer/troubleshooting',
                            ],
                        },
                        {
                            id: 'cli/cypress/changelog',
                            label: 'Changelog',
                            type: 'doc',
                        },
                    ],
                },
                {
                    href: 'https://ui.dhis2.nu',
                    label: 'UI Library',
                    type: 'link',
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
                        'cli/cli/recipes/stable',
                        'cli/cli/recipes/development',
                        'cli/cli/recipes/custom-dhis-config',
                        'cli/cli/recipes/custom-docker-image',
                        'cli/cli/commands/d2-utils-release',
                    ],
                },
            ],
        },

        'aditionalreferences',
        {
            type: 'link',
            label: 'Android SDK',
            href: 'https://docs.dhis2.org/en/develop/developing-with-the-android-sdk/about-this-guide.html',
        },
        {
            type: 'link',
            label: 'Web API',
            href: 'https://docs.dhis2.org/en/develop/using-the-api/dhis-core-version-240/introduction.html',
        },
    ],
}
