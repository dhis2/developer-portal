module.exports = {
    references: [
        {
            type: 'html',
            value: '<strong>References</strong>',
            defaultStyle: true,
        },
        'references-overview',
        {
            type: 'html',
            value: '<strong>Web Development</strong>',
            defaultStyle: true,
        },
        {
            label: 'App Runtime',
            type: 'category',
            collapsed: true,
            items: [
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
                        'app-runtime/hooks/useCurrentUserInfo',
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
                        'app-runtime/components/Plugin',
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
                'app-runtime/advanced/CustomDataProvider',
                'app-runtime/advanced/services',
                'app-runtime/advanced/redux',
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
            label: 'Application Platform',
            type: 'category',
            collapsed: true,
            link: {
                type: 'doc',
                id: 'app-platform/getting-started',
            },
            items: [
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
                            migrate: [
                                {
                                    id: 'app-platform/scripts/migrate/js-to-jsx',
                                    label: 'js-to-jsx',
                                    type: 'doc',
                                },
                            ],
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
                        'app-platform/config/extending-vite-config',
                        'app-platform/config/adding-shortcuts',
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
                    Migration: ['app-platform/migration/v12'],
                },
                {
                    id: 'app-platform/changelog',
                    label: 'Changelog',
                    type: 'doc',
                },
            ],
        },
        {
            label: 'UI Components',
            type: 'category',
            collapsed: true,
            link: {
                type: 'generated-index',
                title: 'Web UI Components',
                slug: 'ui/webcomponents',
            },

            items: [
                {
                    type: 'autogenerated',
                    dirName: 'ui/components',
                },
            ],
        },
        'references/global-shell',
        {
            label: 'Web API Guides',
            type: 'link',
            href: 'https://docs.dhis2.org/en/develop/using-the-api/dhis-core-version-241/introduction.html',
        },
        {
            label: 'Web API Demo',
            type: 'link',
            href: 'https://dhis2.stoplight.io/docs/dhis2/',
        },
        {
            type: 'html',
            value: '<strong>CLI Tooling</strong>',
            defaultStyle: true,
        },
        {
            label: 'd2 style',
            type: 'category',
            collapsed: true,
            link: {
                type: 'doc',
                id: 'cli/style/getting-started',
            },
            items: [
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
            label: 'Cypress',
            type: 'category',
            collapsed: true,
            link: {
                type: 'doc',
                id: 'cli/cypress/getting-started',
            },
            items: [
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
                    id: 'cli/cypress/changelog',
                    label: 'Changelog',
                    type: 'doc',
                },
            ],
        },

        {
            label: 'CLI',
            type: 'category',
            collapsed: true,
            link: {
                type: 'doc',
                id: 'cli/readme',
            },
            items: [
                'cli/readme',
                'cli/cli/commands/create-app',
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
        {
            type: 'html',
            value: '<strong>Mobile Development</strong>',
            defaultStyle: true,
        },
        {
            type: 'link',
            label: 'Android SDK',
            href: 'https://dhis2.github.io/dhis2-android-sdk/api/index.html',
        },
        {
            type: 'link',
            label: 'Mobile UI Library',
            href: 'https://dhis2.github.io/dhis2-mobile-ui/api/-mobile%20-u-i/org.hisp.dhis.mobile.ui.designsystem.component/index.html',
        },
        {
            type: 'html',
            value: '<strong>Additional References</strong>',
            defaultStyle: true,
        },
        'aditionalreferences',
        {
            type: 'link',
            label: 'Design System',
            href: '/design-system',
        },
        {
            type: 'link',
            label: 'Web API',
            href: 'https://docs.dhis2.org/en/develop/using-the-api/dhis-core-version-241/introduction.html',
        },
    ],
}
