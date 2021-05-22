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
        'Fetching data': [
          // 'guides/fetch-data',
        ],
        'UI components': [
          // 'guides/ui-components',
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


