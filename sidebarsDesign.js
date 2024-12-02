module.exports = {
    Sidebar: [
        {
            'Getting started': [
                'getting-started/readme',
                'getting-started/installation',
            ],
        },
        {
            Principles: [
                'principles/color',
                'principles/content-communication',
                'principles/design-for-use',
                'principles/forms',
                'principles/icons',
                'principles/layout',
                'principles/typography',
            ],
        },
        {
            Patterns: [
                'patterns/glossary',
                'patterns/designing-with-time',
                'patterns/writing',
                'patterns/large-data',
            ],
        },
        {
            Utilities: [
                'utilities/constants',
                {
                    Forms: [
                        'utilities/forms/react-final-form',
                        'utilities/forms/transformers',
                        'utilities/forms/validators',
                    ],
                },
            ],
        },
        {
            Help: [
                'help/migrating',
                'help/troubleshooting',
                'help/advanced-usage',
            ],
        },
        'package/changelog',
        {
            type: 'link',
            label: 'Web UI Components',
            href: '/docs/ui/webcomponents',
        },
    ],
}
