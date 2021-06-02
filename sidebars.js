module.exports = {
  docs: {
    'Quick Start': ['getting-started'],
    Tutorials:  [
    'tutorials',
    'tutorials/setup-env', 
    'tutorials/ui-library', 
      {
        'DHIS2 App Runtime': [
          'tutorials/app-runtime-query',
          'tutorials/app-runtime-mutation',
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
        'App Hub': [
          'guides/submit-apphub', 'guides/apphub-guidelines'
        ],
      },
    ], 
    Reference: ['reference'], 
    Conceptual: ['conceptual', 'conceptual/contribute'],
  },
};


