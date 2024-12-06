const redirects = require('./redirects.config.js')

module.exports = {
    title: 'DHIS2 Developer Portal',
    tagline: 'Welcome to the DHIS2 application development community!',
    url: 'https://developers.dhis2.org',
    baseUrl: '/',
    onBrokenLinks: 'throw',
    onBrokenMarkdownLinks: 'warn',
    favicon: 'img/favicon.ico',
    organizationName: 'dhis2',
    projectName: 'developer-portal',
    themeConfig: {
        prism: {
            additionalLanguages: ['java', 'yaml', 'json'],
        },
        navbar: {
            logo: {
                alt: 'DHIS2 Developer Portal',
                src: 'img/dhis2developers.svg',
            },
            items: [
                {
                    to: 'docs',
                    activeBasePath: 'docs',
                    label: 'Guides & Tutorials',
                    position: 'left',
                },
                {
                    to: 'docs/references',
                    activeBasePath: 'docs',
                    label: 'Reference Docs',
                    position: 'left',
                },
                {
                    to: 'design-system',
                    label: 'Design System',
                    position: 'left',
                },
                { to: 'blog', label: 'Blog', position: 'left' },
                {
                    to: 'events/developer-meetups',
                    label: 'Events',
                    position: 'left',
                },
                {
                    to: 'community/support',
                    label: 'Community',
                    position: 'left',
                },
                {
                    type: 'search',
                    position: 'right',
                },
                {
                    href: 'https://github.com/dhis2/developer-portal',
                    label: 'GitHub',
                    position: 'right',
                },
            ],
        },
        colorMode: {
            defaultMode: 'light',

            // Hides the switch in the navbar
            disableSwitch: true,
            respectPrefersColorScheme: false,
        },
        footer: {
            style: 'dark',
            links: [
                {
                    title: 'Docs',
                    items: [
                        {
                            label: 'Quick Start',
                            to: 'docs',
                        },
                    ],
                },
                {
                    title: 'Community',
                    items: [
                        {
                            label: 'DHIS2 Developer Community',
                            to: 'community',
                        },
                    ],
                },
                {
                    title: 'More',
                    items: [
                        {
                            label: 'Blog',
                            to: 'docs',
                        },
                        {
                            label: 'DHIS2.org',
                            to: 'https://dhis2.org',
                        },
                    ],
                },
            ],
            copyright: `Copyright © ${new Date().getFullYear()} The DHIS2 Core Team`,
        },
        announcementBar: {
            content:
                '<div style="text-align:right;margin-right:8px;"><a href="https://www.dhis2.org" target="_blank" rel="noopener" class="domain-nav-item" >DHIS2.org</a > <a href="https://play.dhis2.org" target="_blank" rel="noopener" class="domain-nav-item" >Demo</a > <a href="https://docs.dhis2.org/" target="_blank" rel="noopener" class="domain-nav-item" >Documentation</a > <a href="https://community.dhis2.org" target="_blank" rel="noopener" class="domain-nav-item" >Community</a ></diV>',
            backgroundColor: '#f8fafc',
            textColor: '#051841',
            isCloseable: false,
            id: 'domainNav',
        },
        algolia: {
            // The application ID provided by Algolia
            appId: 'KR61555RZM',
            // Public API key: it's safe to commit it
            apiKey: 'a3aa57dd778bc1116b351eeeba2f16d9',
            indexName: 'dhis2',
            contextualSearch: true,
            searchPagePath: 'search',
        },
    },
    plugins: [
        [
            '@docusaurus/plugin-content-docs',
            {
                id: 'events',
                path: 'events',
                routeBasePath: 'events',
                sidebarPath: require.resolve('./sidebarsEvents.js'),
            },
        ],
        [
            '@docusaurus/plugin-content-docs',
            {
                id: 'community',
                path: 'community',
                routeBasePath: 'community',
                sidebarPath: require.resolve('./sidebarsCommunity.js'),
            },
        ],
        [
            '@docusaurus/plugin-content-docs',
            {
                id: 'design',
                path: 'design',
                routeBasePath: 'design-system',
                sidebarPath: require.resolve('./sidebarsDesign.js'),
            },
        ],
        [
            '@docusaurus/plugin-client-redirects',
            {
                redirects,
            },
        ],
    ],
    presets: [
        [
            '@docusaurus/preset-classic',
            {
                docs: {
                    sidebarPath: require.resolve('./sidebars.js'),
                    editUrl: (params) => {
                        if (params.docPath.indexOf('changelog.md') > -1) {
                            return ''
                        }

                        if (params.docPath.indexOf('cli/cypress') > -1) {
                            return `https://github.com/dhis2/cli-utils-cypress/tree/master/docs${params.docPath.replace(
                                'cli/cypress',
                                ''
                            )}`
                        }

                        if (params.docPath.indexOf('cli/style') > -1) {
                            return `https://github.com/dhis2/cli-style/tree/master/docs${params.docPath.replace(
                                'cli/style',
                                ''
                            )}`
                        }

                        if (params.docPath.indexOf('app-runtime') > -1) {
                            return `https://github.com/dhis2/app-runtime/tree/master/docs${params.docPath.replace(
                                'app-runtime',
                                ''
                            )}`
                        }

                        if (params.docPath.indexOf('app-platform') > -1) {
                            return `https://github.com/dhis2/app-platform/tree/master/docs${params.docPath.replace(
                                'app-platform',
                                ''
                            )}`
                        }

                        if (
                            params.docPath.indexOf('cli/') === 0 &&
                            params.docPath.indexOf('cli/readme.md') === -1
                        ) {
                            return `https://github.com/dhis2/cli/tree/master/docs${params.docPath.replace(
                                'cli/cli',
                                ''
                            )}`
                        }

                        return `https://github.com/dhis2/developer-portal/edit/main/docs/${params.docPath}`
                    },
                },
                blog: {
                    showReadingTime: true,
                    editUrl:
                        'https://github.com/dhis2/developer-portal/edit/main/',
                    authorsMapPath: 'authors.yml',
                    blogSidebarCount: 15,
                    feedOptions: {
                        xslt: true,
                    },
                },
                theme: {
                    customCss: require.resolve('./src/css/custom.css'),
                },
                googleAnalytics: {
                    trackingID: 'UA-157707339-4',
                    anonymizeIP: true,
                },
            },
        ],
    ],
    scripts: [
        {
            src: 'https://widget.kapa.ai/kapa-widget.bundle.js',
            'data-website-id': '0b9680c1-8ad2-4c4d-bb9d-d21ebeb70216',
            'data-project-name': 'DHIS2',
            'data-project-color': '#393D4D',
            'data-project-logo': '/img/logo.png',
            'data-modal-title': 'DHIS2 Developers AI',
            'data-user-analytics-fingerprint-enabled': 'true',
            'data-modal-disclaimer':
                'Answers are AI generated based on the DHIS2 Documentation. Be aware it might not be 100% accurate or up-to-date, check the sources to know for sure.',
            async: true,
        },
    ],
}
