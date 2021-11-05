const redirects = require('./redirects.config.js')

module.exports = {
    title: 'DHIS2 Developer Portal',
    tagline: 'Welcome to the DHIS2 application development community!',
    url: 'https://dhis2.github.io',
    baseUrl: '/',
    onBrokenLinks: 'throw',
    onBrokenMarkdownLinks: 'warn',
    favicon: 'img/favicon.ico',
    organizationName: 'dhis2',
    projectName: 'developer-portal',
    themeConfig: {
        navbar: {
            logo: {
                alt: 'DHIS2 Developer Portal',
                src: 'img/dhis2developers.svg',
            },
            items: [
                {
                    to: 'docs',
                    activeBasePath: 'docs',
                    label: 'Docs',
                    position: 'left',
                },
                { to: 'blog', label: 'Blog', position: 'left' },
                { to: 'events/webinars', label: 'Events', position: 'left' },
                {
                    to: 'community/support',
                    label: 'Community',
                    position: 'left',
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
                            label: 'Getting Started',
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
        googleAnalytics: {
            trackingID: 'UA-157707339-4',
            anonymizeIP: true,
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
                    editUrl:
                        'https://github.com//dhis2/developer-portal/edit/main/',
                },
                blog: {
                    showReadingTime: true,
                    editUrl:
                        'https://github.com/dhis2/developer-portal/edit/main/',
                    authorsMapPath: 'authors.yml',
                },
                theme: {
                    customCss: require.resolve('./src/css/custom.css'),
                },
            },
        ],
    ],
}
