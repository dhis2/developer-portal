module.exports = {
  docs: {
    'Quick Start': ['getting-started'],
    Tutorials:  
    [
      'tutorials',
      {
        '0 - Set up Development': [
          'tutorials/dhis2-docker', 
        ],
        '1 - Learn about the App Platform': [
          // 'tutorials/app-platform',
        ],
        '2 - DHIS2 components & Helper Libraries': [
          // 'tutorials/ui-components',
        ],
      },
    ], 
    Guides: [
      'guides',
      {
        'Local Development': [
          'guides/spin-up-local-instance',
          'guides/create-app-from-scratch',
        ],
        'Fetching data': [
          'guides/fetch-data',
        ],
        'UI components': [
          'guides/ui-components',
        ],
        'App Hub': [
          'guides/submit-apphub', 'guides/apphub-guidelines'
        ],
      },
    ], 
    Reference: ['reference'], 
    Conceptual: ['conceptual'],
  },
};
