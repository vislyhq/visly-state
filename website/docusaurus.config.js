module.exports = {
    title: 'React state for real time apps',
    tagline: 'A React state management library that extends to your server',
    url: 'https://visly.state.app',
    baseUrl: '/',
    onBrokenLinks: 'throw',
    favicon: 'img/logo-black.svg',
    organizationName: 'Visly',
    projectName: 'visly-state',
    themeConfig: {
        prism: {
            theme: require('prism-react-renderer/themes/vsDark'),
        },
        colorMode: {
            disableSwitch: true,
        },
        metadatas: [
            { name: 'twitter:card', content: 'summary_large_image' },
            { name: 'og:image', content: '/img/share-banner.png' },
        ],
        navbar: {
            title: 'Visly State',
            logo: {
                alt: 'Visly State Logo',
                src: 'img/logo.svg',
            },
            items: [
                {
                    to: 'docs/',
                    activeBasePath: 'docs',
                    label: 'Documentation',
                    position: 'left',
                },
                {
                    href: 'https://github.com/vislyhq/visly-state',
                    label: 'GitHub',
                    position: 'left',
                },
                {
                    href: 'https://visly.app/',
                    label: 'Visly',
                    position: 'right',
                },
            ],
        },
        footer: {
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
                            label: 'Stack Overflow',
                            href:
                                'https://stackoverflow.com/questions/tagged/docusaurus',
                        },
                        {
                            label: 'Discord',
                            href: 'https://discordapp.com/invite/docusaurus',
                        },
                        {
                            label: 'Twitter',
                            href: 'https://twitter.com/docusaurus',
                        },
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
                            href: 'https://github.com/vislyhq/visly-state',
                        },
                    ],
                },
            ],
            copyright: `Copyright © ${new Date().getFullYear()} My Project, Inc. Built with Docusaurus.`,
        },
    },
    plugins: ['docusaurus-plugin-sass'],
    presets: [
        [
            '@docusaurus/preset-classic',
            {
                docs: {
                    sidebarPath: require.resolve('./sidebars.js'),
                    editUrl:
                        'https://github.com/vislyhq/visly-state/edit/main/website/',
                },
                blog: {
                    showReadingTime: true,
                    editUrl:
                        'https://github.com/vislyhq/visly-state/edit/main/website/blog/',
                },
                theme: {
                    customCss: require.resolve('./src/css/custom.scss'),
                },
            },
        ],
    ],
}
