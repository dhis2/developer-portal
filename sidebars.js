module.exports = {
  docs: {
    'Quick Start': ['getting-started'],
    Tutorials:  [
    'tutorials',
    'tutorials/setup-env', 
      {
        'DHIS2 App Runtime': [
          'tutorials/app-runtime-query',
        ],
      },
    ], 
    Guides: [
      'guides',
      {
        'Local Development': [
          'guides/spin-up-local-instance',
          'guides/code-style',
          'guides/debug-instance',
        ],
        'UI Library': [
          'guides/ui-table',
        ],
        'DHIS2 App Runtime': [
          'guides/query-playground',
        ],
        'App Hub': [
          'guides/submit-apphub', 'guides/apphub-guidelines'
        ],
      },
    ], 
    Reference: ['reference'], 
    Conceptual: ['conceptual', 'conceptual/contribute'],
  },
};


