const sidebarMobile = require('./sidebarsMobile.js')

module.exports = {
    docs: [
        {
            type: 'html',
            value: '<strong>Guides & Tutorials</strong>',
            defaultStyle: true,
        },

        'guides-overview',

        {
            type: 'html',
            value: '<strong>Getting started</strong>',
            defaultStyle: true,
        },

        'quickstart',
        'tutorials/setup-env',
        'quickstart/quickstart-web',
        'quickstart/quickstart-android',
        'tutorials/dhis2-docker',
        {
            type: 'html',
            value: '<strong>Web Development</strong>',
            defaultStyle: true,
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
            label: 'Application Runtime',
            type: 'category',
            collapsed: true,
            link: {
                type: 'doc',
                id: 'app-runtime/getting-started',
            },
            items: [
                'app-runtime/getting-started',
                'tutorials/ui-library',
                'app-runtime/provider',
                {
                    Hooks: [
                        {
                            id: 'app-runtime/hooks/README',
                            label: 'Overview',
                            type: 'doc',
                        },
                        'tutorials/app-runtime-query',
                        'tutorials/app-runtime-mutation',
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
                        'app-runtime/advanced/CustomDataProvider',
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
            label: 'Capture Plugins',
            type: 'category',
            collapsed: true,
            collapsible: true,
            link: {
                type: 'doc',
                id: 'capture-plugins/developer/getting-started',
            },
            items: [
                'capture-plugins/developer/getting-started',
                'capture-plugins/developer/develop-a-capture-plugin',
                'capture-plugins/developer/configure-a-capture-plugin',
                {
                    'Form Field Plugin': [
                        'capture-plugins/developer/form-field-plugins/introduction',
                        'capture-plugins/developer/form-field-plugins/developer-details',
                        'capture-plugins/developer/form-field-plugins/manual-setup',
                    ],
                    'Enrollment Plugin': [
                        'capture-plugins/developer/enrollment-plugins/introduction',
                        'capture-plugins/developer/enrollment-plugins/developer-details',
                        'capture-plugins/developer/enrollment-plugins/manual-setup',
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
                    'Web UI Library': [
                        'guides/ui-table',
                        {
                            label: 'Web UI Component Recipes',
                            type: 'category',
                            collapsed: true,
                            link: {
                                type: 'generated-index',
                                title: 'Web UI Components Recipes',
                                slug: 'ui/recipes',
                            },
                            items: [
                                {
                                    type: 'autogenerated',
                                    dirName: 'ui/recipes',
                                },
                            ],
                        },
                    ],
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
        {
            type: 'html',
            value: '<strong>Mobile Development</strong>',
            defaultStyle: true,
        },
        sidebarMobile.mobile,
        {
            type: 'html',
            value: '<strong>Integration</strong>',
            defaultStyle: true,
        },

        'integration/overview',
        'integration/dhis2-java-sdk',
        'integration/apache-camel',
        'integration/camel-dhis2-component',
        {
            type: 'html',
            value: '<strong>General Guides</strong>',
            defaultStyle: true,
        },
        'dev-videos',
        {
            Conceptual: [
                'conceptual',
                'conceptual/git-workflow',
                'conceptual/jira-workflow',
            ],
        },
    ],
}
