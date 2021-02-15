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
      // title: 'DHIS2 Developer Portal',
      logo: {
        alt: 'DHIS2 Developer Portal',
        src: 'img/dhis2developers.svg',
      },
      items: [
        {
          to: 'docs/',
          activeBasePath: 'docs',
          label: 'Docs',
          position: 'left',
        },
        {to: 'blog', label: 'Blog', position: 'left'},
        {to: 'events', label: 'Events', position: 'left'},
        {to: 'community', label: 'Community', position: 'left'},
        {
          href: 'https://github.com/dhis2/developer-portal',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Style Guide',
              to: 'docs/',
            },
            {
              label: 'Second Doc',
              to: 'docs/doc2/',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Community of Practice',
              href: 'https://community.dhis2.org/',
            },
            {
              label: 'Slack',
              href: '#',
            }
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Blog',
              to: 'blog',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/dhis2/developer-portal',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} My Project, Inc. Built with Docusaurus.`,
    },
  },
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
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
