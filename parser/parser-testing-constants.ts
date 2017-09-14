import { MDDefinition } from '../object/metadata/MDDefinition';
import { MDElement } from '../object/metadata/MDElement';

export const DEFINITION_PARSER_INPUT = {
   '@xmlns': 'http://dms.ec.gc.ca/schema/metadata/1.0',
   '@gml': 'http://www.opengis.net/gml',
   '@om': 'http://www.opengis.net/om/1.0',
   '@xlink': 'http://www.w3.org/1999/xlink',
   '@xsi': 'http://www.w3.org/2001/XMLSchema-instance',
   'member': {
      'Metadata': {
         'metadata': {
            'set': {
               'general': {
                  'dataset': {
                     '@name': '/msc/mr/system/user/definition-xml-2.0'
                  },
                  'id': {
                     '@href': '/metadata/msc/mr/system/user/definition-xml-2.0/1.0'
                  }
               },
               'identification-elements': {
                  'identification-element': [
                     {
                        '@group': 'history',
                        '@name': 'created_by',
                        '@uom': 'unitless',
                        '@value': 'dms'
                     },
                     {
                        '@group': 'history',
                        '@name': 'reason_for_change',
                        '@uom': 'unitless',
                        '@value': 'initial_load'
                     }
                  ]
               }
            }
         },
         'observedproperty': {
            '@href': '/schema/metadata/1.0'
         },
         'result': {
            'elements': {
               'element': [
                  {
                     '@format': 'string',
                     '@group': 'domain',
                     '@id': '64dff3a98d585a5d',
                     '@language-sensitive': false,
                     '@max': '*',
                     '@min': 1,
                     '@name': 'authentication',
                     '@uom': 'unitless',
                     '@pattern': '',
                     '@index': 1,
                     '@value': '',
                     'description': [
                        {
                           '@name': 'description',
                           'language': [
                              {
                                 '@name': 'en',
                                 '@value': 'One viable authentication module for this user.'
                              },
                              {
                                 '@name': 'fr',
                                 '@value': 'Un module d\'authentification viable pour cet utilisateur.'
                              }
                           ]
                        },
                        {
                           '@name': 'display-name',
                           'language': [
                              {
                                 '@name': 'en',
                                 '@value': 'Authentication Module'
                              },
                              {
                                 '@name': 'fr',
                                 '@value': 'Module d\'authentification'
                              }
                           ]
                        }
                     ],
                     'element': [
                        {
                           '@format': 'string',
                           '@group': 'domain',
                           '@id': 'c8154bc1f47699af',
                           '@language-sensitive': false,
                           '@max': 1,
                           '@min': 1,
                           '@index': 1,
                           '@name': 'domain',
                           '@uom': 'unitless',
                           '@value': '',
                           '@pattern': '',
                           'description': [
                              {
                                 '@name': 'description',
                                 'language': [
                                    {
                                       '@name': 'en',
                                       '@value': 'The domain name of the account.'
                                    },
                                    {
                                       '@name': 'fr',
                                       '@value': 'Le nom de domaine du compte.'
                                    }
                                 ]
                              },
                              {
                                 '@name': 'display-name',
                                 'language': [
                                    {
                                       '@name': 'en',
                                       '@value': 'Domain'
                                    },
                                    {
                                       '@name': 'fr',
                                       '@value': 'Domaine'
                                    }
                                 ]
                              }
                           ]
                        }

                     ]
                  }
               ]
            }
         }
      }
   }
};

export const DEFINITION_PARSER_OUTPUT: MDDefinition = {
    dataset: '/msc/mr/system/user/definition-xml-2.0',
    elements: [
      {
        format: 'string',
        group: 'domain',
        id: '64dff3a98d585a5d',
        index: 1,
        languageSensitive: false,
        max: '*',
        min: '1',
        name: 'authentication',
        pattern: '',
        uom: 'unitless',
        value: '',
        description: {english: 'One viable authentication module for this user.',
          french: 'Un module d\'authentification viable pour cet utilisateur.'},
        displayName: {english: 'Authentication Module', french: 'Module d\'authentification'},
        elements: [{
          format: 'string',
          group: 'domain',
          id: 'c8154bc1f47699af',
          index: 1,
          languageSensitive: false,
          max: '1',
          min: '1',
          name: 'domain',
          pattern: '',
          uom: 'unitless',
          value: '',
          enums: [],
          elements: [],
          description: {english: 'The domain name of the account.', french: 'Le nom de domaine du compte.'},
          displayName: {english: 'Domain', french: 'Domaine'}
        }],
        enums: []
      }
    ],
    id: '/metadata/msc/mr/system/user/definition-xml-2.0/1.0',
    identificationElements: [
      {group: 'history', name: 'created_by', uom: 'unitless', value: 'dms'},
      {group: 'history', name: 'reason_for_change', uom: 'unitless', value: 'initial_load'}
    ]
};

export const DESCRIPTION_PARSER_INPUT = {
    '@name': 'description',
    'language': [
      {
          '@name': 'en',
          '@value': 'One viable authentication module for this user.'
      },
      {
          '@name': 'fr',
          '@value': 'Un module d\'authentification viable pour cet utilisateur.'
      }
    ]
};

export const DESCRIPTION_PARSER_OUTPUT = {
  english: 'One viable authentication module for this user.',
  french: 'Un module d\'authentification viable pour cet utilisateur.'
};

export const ELEMENT_PARSER_INPUT = {
    '@format': 'string',
    '@group': 'domain',
    '@id': '64dff3a98d585a5d',
    '@language-sensitive': false,
    '@max': '*',
    '@min': 1,
    '@name': 'authentication',
    '@uom': 'unitless',
    '@pattern': '',
    '@index': 1,
    '@value': '',
    'description': [
      {
          '@name': 'description',
          'language': [
            {
                '@name': 'en',
                '@value': 'One viable authentication module for this user.'
            },
            {
                '@name': 'fr',
                '@value': 'Un module d\'authentification viable pour cet utilisateur.'
            }
          ]
      },
      {
          '@name': 'display-name',
          'language': [
            {
                '@name': 'en',
                '@value': 'Authentication Module'
            },
            {
                '@name': 'fr',
                '@value': 'Module d\'authentification'
            }
          ]
      }
    ],
    elements: []
};

export const ELEMENT_PARSER_OUTPUT = {
    format: 'string',
    group: 'domain',
    id: '64dff3a98d585a5d',
    index: 1,
    languageSensitive: false,
    max: '*',
    min: '1',
    name: 'authentication',
    pattern: '',
    uom: 'unitless',
    value: '',
    description: {english: 'One viable authentication module for this user.',
      french: 'Un module d\'authentification viable pour cet utilisateur.'},
    displayName: {english: 'Authentication Module', french: 'Module d\'authentification'},
    elements: [],
    enums: []
};

export const INSTANCE_DEFINITION_PARSER_INPUT = {
   '@xmlns': 'http://dms.ec.gc.ca/schema/metadata/1.0',
   '@gml': 'http://www.opengis.net/gml',
   '@om': 'http://www.opengis.net/om/1.0',
   '@xlink': 'http://www.w3.org/1999/xlink',
   '@xsi': 'http://www.w3.org/2001/XMLSchema-instance',
   'member': {
      'Metadata': {
         'metadata': {
            'set': {
               'general': {
                  'dataset': {
                     '@name': '/msc/mr/system/user/instance-xml-2.0'
                  },
                  'id': {
                     '@href': '/metadata/msc/mr/system/user/instance-xml-2.0/testman?version=15.0'
                  },
                  'parent': {
                     '@href': '/metadata/msc/mr/system/user/definition-xml-2.0/1.0'
                  },
                  'deactivated-instance': {
                     '@href': '/metadata/msc/mr/system/user/instance-xml-2.0/testman?version=14.0'
                  }
               },
               'identification-elements': {
                  'identification-element': [
                     {
                        '@group': 'history',
                        '@name': 'active_flag',
                        '@uom': 'unitless',
                        '@value': 'true'
                     },
                     {
                        '@group': 'history',
                        '@name': 'eff_end_datetime',
                        '@uom': 'datetime',
                        '@value': '2017-09-15T00:00:12.000Z'
                     }
                  ]
               }
            }
         },
         'result': {
            'elements': {
               'element': [
                  {
                     '@def_id': '56af20bc1bed3440',
                     '@group': 'account',
                     '@id': 'f2a20a197dd1a4f4',
                     '@index': 1,
                     '@name': 'last_name',
                     '@uom': 'unitless',
                     '@value': 'Test'
                  },
                  {
                     '@def_id': '64dff3a98d585a5d',
                     '@group': 'domain',
                     '@id': '7b1eb450e5ea9d11',
                     '@index': 1,
                     '@name': 'authentication',
                     '@uom': 'unitless',
                     '@value': 'das',
                     'element': [
                        {
                           '@def_id': 'c8154bc1f47699af',
                           '@group': 'domain',
                           '@id': 'c1feff7cb66bb2ac',
                           '@index': 1,
                           '@name': 'domain',
                           '@uom': 'unitless',
                           '@value': 'fd'
                        }
                     ]
                  }
               ]
            }
         }
      }
   }
};

export const INSTANCE_DEFINITION_PARSER_OUTPUT = {
    dataset: '/msc/mr/system/user/instance-xml-2.0',
    parent: '/metadata/msc/mr/system/user/definition-xml-2.0/1.0',
    elements: [{
        def_id: '56af20bc1bed3440',
        group: 'account',
        id: 'f2a20a197dd1a4f4',
        index: 1,
        instelements: [],
        name: 'last_name',
        uom: 'unitless',
        value: 'Test'
    }, {
        def_id: '64dff3a98d585a5d',
        group: 'domain',
        id: '7b1eb450e5ea9d11',
        index: 1,
        name: 'authentication',
        uom: 'unitless',
        value: 'das',
        instelements: [
            {
                def_id: 'c8154bc1f47699af',
                group: 'domain',
                id: 'c1feff7cb66bb2ac',
                index: 1,
                instelements: [],
                name: 'domain',
                uom: 'unitless',
                value: 'fd'
            }
        ]
    }],
    identificationElements: [
        {group: 'history', name: 'active_flag', uom: 'unitless', value: 'true'},
        {group: 'history', name: 'eff_end_datetime', uom: 'datetime', value: '2017-09-15T00:00:12.000Z'}
    ]
};

export const INSTANCE_ELEMENT_PARSER_INPUT = {
    '@def_id': '56af20bc1bed3440',
    '@group': 'account',
    '@id': 'f2a20a197dd1a4f4',
    '@index': 1,
    '@name': 'last_name',
    '@uom': 'unitless',
    '@value': 'Test',
    'element': [
        {
        '@def_id': 'c8154bc1f47699af',
        '@group': 'domain',
        '@id': 'c1feff7cb66bb2ac',
        '@index': 1,
        '@name': 'domain',
        '@uom': 'unitless',
        '@value': 'fd'
        }
    ]
};

export const INSTANCE_ELEMENT_PARSER_OUTPUT = {
    def_id: '56af20bc1bed3440',
    group: 'account',
    id: 'f2a20a197dd1a4f4',
    index: 1,
    name: 'last_name',
    uom: 'unitless',
    value: 'Test',
    instelements: [
        {
            def_id: 'c8154bc1f47699af',
            group: 'domain',
            id: 'c1feff7cb66bb2ac',
            index: 1,
            name: 'domain',
            uom: 'unitless',
            value: 'fd',
            instelements: []
        }
    ]
};

export const IDENTIFICATION_ELEMENTS_PARSER_INPUT = {
    '@group': 'history',
    '@name': 'eff_end_datetime',
    '@uom': 'datetime',
    '@value': '2017-09-15T00:00:12.000Z'
};

export const IDENTIFICATION_ELEMENTS_PARSER_OUTPUT = {
    group: 'history',
    name: 'eff_end_datetime',
    uom: 'datetime',
    value: '2017-09-15T00:00:12.000Z',
};

export const METADATA_FORM_PARSER_OUTPUT = {
    general: {
      dataset: '/msc/mr/system/user/instance-xml-2.0',
      parent: '/metadata/msc/mr/system/user/definition-xml-2.0/1.0'
    },
    identification: {
      reason_for_change: 'Updated through Pegasus - to change publisher',
      created_by: 'dms',
      effective_start: '2016-09-12TT10:11:11.222Z'
    },
    elements: [
      {
        element_group: 'account',
        element_name: 'email',
        element_uom: 'unitless',
        element_value: 'email@email.com',
        elements: []
      },
      {
        element_group: 'account',
        element_name: 'first_name',
        element_uom: 'unitless',
        element_value: 'Wayne',
        elements: []
      },
      {
        element_group: 'account',
        element_name: 'last_name',
        element_uom: 'unitless',
        element_value: 'Gretzky',
        elements: []
      },
      {
        element_group: 'account',
        element_name: 'username',
        element_uom: 'unitless',
        element_value: 'coolusername',
        elements: []
      },
      {
        element_group: 'domain',
        element_name: 'authentication',
        element_uom: 'unitless',
        element_value: 'autheniticate',
        elements: [
          {
            element_group: 'domain',
            element_name: 'domain',
            element_uom: 'unitless',
            element_value: 'domain',
            elements: []
          },
          {
            element_group: 'domain',
            element_name: 'username',
            element_uom: 'unitless',
            element_value: 'username',
            elements: []}
        ]
      }
    ]
};

export const METADATA_FORM_PARSER_INPUT = {
  'reasonForChange': {
    'value': 'to change publisher',
    'timeTemp': ''
  },
  'effectiveStart': {
    'value': '2016-09-12',
    'timeTemp': 'T10:11:11.222'
  },
  'effectiveEnd': {
    'value': '',
    'timeTemp': ''
  },
  'elements': [
    {
      'multiple': [
        {
          'valueGroup': {
            'value': 'email@email.com',
            'timeTemp': ''
          },
          'definitionID': '8c98a6c73cdf189f',
          'uriParameter': null,
          'elements': []
        }
      ]
    },
    {
      'multiple': [
        {
          'valueGroup': {
            'value': 'Wayne',
            'timeTemp': ''
          },
          'definitionID': '55150785db4102b8',
          'uriParameter': null,
          'elements': []
        }
      ]
    },
    {
      'multiple': [
        {
          'valueGroup': {
            'value': 'Gretzky',
            'timeTemp': ''
          },
          'definitionID': '56af20bc1bed3440',
          'uriParameter': null,
          'elements': []
        }
      ]
    },
    {
      'multiple': []
    },
    {
      'multiple': [
        {
          'valueGroup': {
            'value': 'coolusername',
            'timeTemp': ''
          },
          'definitionID': 'a3f0efbb828fabf0',
          'uriParameter': 1,
          'elements': []
        }
      ]
    },
    {
      'multiple': [
        {
          'valueGroup': {
            'value': 'autheniticate',
            'timeTemp': ''
          },
          'definitionID': '64dff3a98d585a5d',
          'uriParameter': null,
          'elements': [
            {
              'multiple': [
                {
                  'valueGroup': {
                    'value': 'domain',
                    'timeTemp': ''
                  },
                  'definitionID': 'c8154bc1f47699af',
                  'uriParameter': null,
                  'elements': []
                }
              ]
            },
            {
              'multiple': [
                {
                  'valueGroup': {
                    'value': 'username',
                    'timeTemp': ''
                  },
                  'definitionID': 'a86f5988dc5c0892',
                  'uriParameter': null,
                  'elements': []
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};

export const METADATA_FORM_PARSER_INPUT_1 = {
   '@xmlns': 'http://dms.ec.gc.ca/schema/metadata/1.0',
   '@gml': 'http://www.opengis.net/gml',
   '@om': 'http://www.opengis.net/om/1.0',
   '@xlink': 'http://www.w3.org/1999/xlink',
   '@xsi': 'http://www.w3.org/2001/XMLSchema-instance',
   'member': {
      'Metadata': {
         'metadata': {
            'set': {
               'general': {
                  'dataset': {
                     '@name': '/msc/mr/system/user/definition-xml-2.0'
                  },
                  'id': {
                     '@href': '/metadata/msc/mr/system/user/definition-xml-2.0/1.0'
                  }
               },
               'identification-elements': {
                  'identification-element': [
                     {
                        '@group': 'history',
                        '@name': 'created_by',
                        '@value': 'dms'
                     },
                     {
                        '@group': 'history',
                        '@name': 'reason_for_change',
                        '@value': 'initial_load'
                     },
                     {
                        '@group': 'description',
                        '@name': 'short_label',
                        '@value': 'user'
                     },
                     {
                        '@group': 'history',
                        '@name': 'creation_datetime',
                        '@uom': 'datetime',
                        '@value': '2017-06-16T23:10:54.726Z'
                     },
                     {
                        '@group': 'description',
                        '@name': 'display_name_en',
                        '@value': 'User'
                     },
                     {
                        '@group': 'description',
                        '@name': 'display_name_fr',
                        '@value': 'Utilisateur'
                     },
                     {
                        '@group': 'description',
                        '@name': 'description_en',
                        '@value': 'A user within the system.'
                     },
                     {
                        '@group': 'description',
                        '@name': 'description_fr',
                        '@value': 'Un utilisateur au sein du système.'
                     },
                     {
                        '@group': 'history',
                        '@name': 'version',
                        '@value': 1
                     }
                  ]
               }
            }
         },
         'observedproperty': {
            '@href': '/schema/metadata/1.0'
         },
         'result': {
            'elements': {
               'element': [
                  {
                     '@format': 'string',
                     '@group': 'account',
                     '@id': '8c98a6c73cdf189f',
                     '@language-sensitive': 'false',
                     '@max': 1,
                     '@min': 1,
                     '@name': 'email',
                     '@pattern': '([a-zA-Z0-9_-])*.([a-zA-Z0-9_-])*@[a-z]+(.[a-z]+)+',
                     '@uom': 'unitless',
                     '@value': '',
                     'description': [
                        {
                           '@name': 'description',
                           'language': [
                              {
                                 '@name': 'en',
                                 '@value': 'The email of the user.'
                              },
                              {
                                 '@name': 'fr',
                                 '@value': 'L\'email de l\'utilisateur.'
                              }
                           ]
                        },
                        {
                           '@name': 'display-name',
                           'language': [
                              {
                                 '@name': 'en',
                                 '@value': 'Email'
                              },
                              {
                                 '@name': 'fr',
                                 '@value': 'E-mail'
                              }
                           ]
                        }
                     ]
                  },
                  {
                     '@format': 'string',
                     '@group': 'account',
                     '@id': '55150785db4102b8',
                     '@language-sensitive': 'false',
                     '@max': 1,
                     '@min': 1,
                     '@name': 'first_name',
                     '@pattern': '[A-Z]{1}[a-z]{1}[a-z]*(-[A-Z]{1}[a-z]{1}[a-z]*)*',
                     '@uom': 'unitless',
                     '@value': '',
                     'description': [
                        {
                           '@name': 'description',
                           'language': [
                              {
                                 '@name': 'en',
                                 '@value': 'The first name of the user.'
                              },
                              {
                                 '@name': 'fr',
                                 '@value': 'Le prénom de l\'utilisateur.'
                              }
                           ]
                        },
                        {
                           '@name': 'display-name',
                           'language': [
                              {
                                 '@name': 'en',
                                 '@value': 'First Name'
                              },
                              {
                                 '@name': 'fr',
                                 '@value': 'Prénom'
                              }
                           ]
                        }
                     ]
                  },
                  {
                     '@format': 'string',
                     '@group': 'account',
                     '@id': '56af20bc1bed3440',
                     '@language-sensitive': 'false',
                     '@max': 1,
                     '@min': 1,
                     '@name': 'last_name',
                     '@pattern': '[A-Z]{1}[a-z]{1}[a-z]*(-[A-Z]{1}[a-z]{1}[a-z]*)*',
                     '@uom': 'unitless',
                     '@value': '',
                     'description': [
                        {
                           '@name': 'description',
                           'language': [
                              {
                                 '@name': 'en',
                                 '@value': 'The last name of the user.'
                              },
                              {
                                 '@name': 'fr',
                                 '@value': 'Le nom de l\'utilisateur.'
                              }
                           ]
                        },
                        {
                           '@name': 'display-name',
                           'language': [
                              {
                                 '@name': 'en',
                                 '@value': 'Last Name'
                              },
                              {
                                 '@name': 'fr',
                                 '@value': 'Nom'
                              }
                           ]
                        }
                     ]
                  },
                  {
                     '@format': 'string',
                     '@group': 'account',
                     '@id': '5193732637a44576',
                     '@language-sensitive': 'false',
                     '@max': 1,
                     '@min': 0,
                     '@name': 'other_info',
                     '@uom': 'unitless',
                     '@value': '',
                     'description': [
                        {
                           '@name': 'description',
                           'language': [
                              {
                                 '@name': 'en',
                                 '@value': 'Additional information about the user.'
                              },
                              {
                                 '@name': 'fr',
                                 '@value': 'Plus d\'informations sur l\'utilisateur.'
                              }
                           ]
                        },
                        {
                           '@name': 'display-name',
                           'language': [
                              {
                                 '@name': 'en',
                                 '@value': 'Additional Information'
                              },
                              {
                                 '@name': 'fr',
                                 '@value': 'Information complémentaire'
                              }
                           ]
                        }
                     ]
                  },
                  {
                     '@format': 'string',
                     '@group': 'account',
                     '@id': 'a3f0efbb828fabf0',
                     '@index': 1,
                     '@language-sensitive': 'false',
                     '@max': 1,
                     '@min': 1,
                     '@name': 'username',
                     '@uom': 'unitless',
                     '@value': '',
                     'description': [
                        {
                           '@name': 'description',
                           'language': [
                              {
                                 '@name': 'en',
                                 '@value': 'The username of the user.'
                              },
                              {
                                 '@name': 'fr',
                                 '@value': 'Le nom de l\'utilisateur.'
                              }
                           ]
                        },
                        {
                           '@name': 'display-name',
                           'language': [
                              {
                                 '@name': 'en',
                                 '@value': 'Username'
                              },
                              {
                                 '@name': 'fr',
                                 '@value': 'Nom d\’utilisateur'
                              }
                           ]
                        }
                     ]
                  },
                  {
                     '@format': 'string',
                     '@group': 'domain',
                     '@id': '64dff3a98d585a5d',
                     '@language-sensitive': 'false',
                     '@max': '*',
                     '@min': 1,
                     '@name': 'authentication',
                     '@uom': 'unitless',
                     '@value': '',
                     'description': [
                        {
                           '@name': 'description',
                           'language': [
                              {
                                 '@name': 'en',
                                 '@value': 'One viable authentication module for this user.'
                              },
                              {
                                 '@name': 'fr',
                                 '@value': 'Un module d\'authentification viable pour cet utilisateur.'
                              }
                           ]
                        },
                        {
                           '@name': 'display-name',
                           'language': [
                              {
                                 '@name': 'en',
                                 '@value': 'Authentication Module'
                              },
                              {
                                 '@name': 'fr',
                                 '@value': 'Module d\'authentification'
                              }
                           ]
                        }
                     ],
                     'element': [
                        {
                           '@format': 'string',
                           '@group': 'domain',
                           '@id': 'c8154bc1f47699af',
                           '@language-sensitive': 'false',
                           '@max': 1,
                           '@min': 1,
                           '@name': 'domain',
                           '@uom': 'unitless',
                           '@value': '',
                           'description': [
                              {
                                 '@name': 'description',
                                 'language': [
                                    {
                                       '@name': 'en',
                                       '@value': 'The domain name of the account.'
                                    },
                                    {
                                       '@name': 'fr',
                                       '@value': 'Le nom de domaine du compte.'
                                    }
                                 ]
                              },
                              {
                                 '@name': 'display-name',
                                 'language': [
                                    {
                                       '@name': 'en',
                                       '@value': 'Domain'
                                    },
                                    {
                                       '@name': 'fr',
                                       '@value': 'Domaine'
                                    }
                                 ]
                              }
                           ]
                        },
                        {
                           '@format': 'string',
                           '@group': 'domain',
                           '@id': 'a86f5988dc5c0892',
                           '@language-sensitive': 'false',
                           '@max': 1,
                           '@min': 1,
                           '@name': 'username',
                           '@uom': 'unitless',
                           '@value': '',
                           'description': [
                              {
                                 '@name': 'description',
                                 'language': [
                                    {
                                       '@name': 'en',
                                       '@value': 'The username of the user.'
                                    },
                                    {
                                       '@name': 'fr',
                                       '@value': 'Le nom de l\'utilisateur.'
                                    }
                                 ]
                              },
                              {
                                 '@name': 'display-name',
                                 'language': [
                                    {
                                       '@name': 'en',
                                       '@value': 'Username'
                                    },
                                    {
                                       '@name': 'fr',
                                       '@value': 'Nom d’utilisateur'
                                    }
                                 ]
                              }
                           ]
                        }
                     ]
                  }
               ]
            }
         }
      }
   }
};
