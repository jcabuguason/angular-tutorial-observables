export default class StationExample {

static station1 = {
  '@xmlns': 'http:\/\/dms.ec.gc.ca\/schema\/metadata\/1.0',
  '@gml': 'http:\/\/www.opengis.net\/gml',
  '@om': 'http:\/\/www.opengis.net\/om\/1.0',
  '@xlink': 'http:\/\/www.w3.org\/1999\/xlink',
  '@xsi': 'http:\/\/www.w3.org\/2001\/XMLSchema-instance',
  'member': {
    'Metadata': {
      'metadata': {
        'set': {
          'general': {
            'dataset': {
              '@name': '\/msc\/mr\/surface_monitoring\/staci_station\/instance-xml-2.0'
            },
            'id': {
              '@href': '\/metadata\/msc\/mr\/surface_monitoring\/staci_station\/instance-xml-2.0\/1017099?version=27.0'
            },
            'parent': {
              '@href': '\/metadata\/msc\/mr\/surface_monitoring\/staci_station\/definition-xml-2.0\/1.0'
            }
          },
          'identification-elements': {
            'identification-element': [
              {
                '@group': 'history',
                '@name': 'active_flag',
                '@value': 'true'
              },
              {
                '@group': 'history',
                '@name': 'creation_datetime',
                '@uom': 'datetime',
                '@value': '2017-12-01T13:17:54.728Z'
              },
              {
                '@group': 'history',
                '@name': 'version',
                '@value': 27.0
              },
              {
                '@group': 'history',
                '@name': 'system_generated',
                '@value': 'false'
              },
              {
                '@group': 'history',
                '@name': 'eff_start_datetime',
                '@uom': 'datetime',
                '@value': '2017-11-20T18:10:00.000Z'
              },
              {
                '@group': 'history',
                '@name': 'created_by',
                '@value': 'dms'
              },
              {
                '@group': 'history',
                '@name': 'reason_for_change',
                '@value': 'Updated by JICC'
              }
            ]
          },
          'featureOfInterest': {
            'FeatureCollection': {
              'location': {
                'Point': {
                  'pos': '48.775 -123.1281'
                }
              }
            }
          }
        }
      },
      'result':{
        'elements':{
          'element':[
            {
              '@def_id': '5736052e72589588',
              '@group': 'barometry',
              '@id': '39be46a00e71e108',
              '@index':1,
              '@name': 'barometer_pressure_offset',
              '@uom': 'unitless',
              '@value':0.0,
              'element':[
                {
                  '@def_id': '9bc63aad0d874091',
                  '@group': 'information',
                  '@id': '97a304981c62d11',
                  '@index':1,
                  '@name': 'data_source',
                  '@uom': 'unitless',
                  '@value': 'JICC'
                },
                {
                  '@def_id': 'f08c5608e48bb468',
                  '@group': 'information',
                  '@id': 'c8e46ca4c99f5776',
                  '@index':1,
                  '@name': 'writable',
                  '@uom': 'unitless',
                  '@value': 'true'
                },
                {
                  '@def_id': '4326ce45f22c569c',
                  '@group': 'paroscientific_coefficients',
                  '@id': '22d79f09fe556648',
                  '@index':1,
                  '@name': 'row',
                  '@uom': 'unitless',
                  '@value':1,
                  'element':[
                    {
                      '@def_id': '9f13e86505acb0c5',
                      '@group': 'paroscientific_coefficients',
                      '@id': '1d7613f72289e782',
                      '@index':1,
                      '@name': 'coefficient',
                      '@uom': 'unitless',
                      '@value':0.0
                    },
                    {
                      '@def_id': '9f13e86505acb0c5',
                      '@group': 'paroscientific_coefficients',
                      '@id': '1892212d9aa22d3b',
                      '@index':2,
                      '@name': 'coefficient',
                      '@uom': 'unitless',
                      '@value':0.0
                    },
                    {
                      '@def_id': '9f13e86505acb0c5',
                      '@group': 'paroscientific_coefficients',
                      '@id': '24ab8d3b381dd23a',
                      '@index':3,
                      '@name': 'coefficient',
                      '@uom': 'unitless',
                      '@value':0.0
                    }
                  ]
                },
                {
                  '@def_id': '4326ce45f22c569c',
                  '@group': 'paroscientific_coefficients',
                  '@id': '104d002a91cde95a',
                  '@index':2,
                  '@name': 'row',
                  '@uom': 'unitless',
                  '@value':2,
                  'element':[
                    {
                      '@def_id': '9f13e86505acb0c5',
                      '@group': 'paroscientific_coefficients',
                      '@id': '33c270bdc65bccbc',
                      '@index':1,
                      '@name': 'coefficient',
                      '@uom': 'unitless',
                      '@value':0.0
                    },
                    {
                      '@def_id': '9f13e86505acb0c5',
                      '@group': 'paroscientific_coefficients',
                      '@id': 'ec74560ae7ed4f88',
                      '@index':2,
                      '@name': 'coefficient',
                      '@uom': 'unitless',
                      '@value':0.0
                    },
                    {
                      '@def_id': '9f13e86505acb0c5',
                      '@group': 'paroscientific_coefficients',
                      '@id': '9bfbb4aa45d4c907',
                      '@index':3,
                      '@name': 'coefficient',
                      '@uom': 'unitless',
                      '@value':0.0
                    }
                  ]
                },
                {
                  '@def_id': '4326ce45f22c569c',
                  '@group': 'paroscientific_coefficients',
                  '@id': '206743b11772e22f',
                  '@index':3,
                  '@name': 'row',
                  '@uom': 'unitless',
                  '@value':3,
                  'element':[
                    {
                      '@def_id': '9f13e86505acb0c5',
                      '@group': 'paroscientific_coefficients',
                      '@id': '4df6ca344af83616',
                      '@index':1,
                      '@name': 'coefficient',
                      '@uom': 'unitless',
                      '@value':0.0
                    },
                    {
                      '@def_id': '9f13e86505acb0c5',
                      '@group': 'paroscientific_coefficients',
                      '@id': 'd4596b0ad88b737e',
                      '@index':2,
                      '@name': 'coefficient',
                      '@uom': 'unitless',
                      '@value':0.0
                    },
                    {
                      '@def_id': '9f13e86505acb0c5',
                      '@group': 'paroscientific_coefficients',
                      '@id': 'def0f7d46c1df726',
                      '@index':3,
                      '@name': 'coefficient',
                      '@uom': 'unitless',
                      '@value':0.0
                    }
                  ]
                }
              ]
            },
            {
              '@def_id': '9aab2e9fb1b5ecd7',
              '@group': 'classification',
              '@id': 'a3dd007286770c3d',
              '@index':1,
              '@name': 'data_set',
              '@uom': 'unitless',
              '@value': 'SWCN',
              'element':[
                {
                  '@def_id': '5798b21dffdca87a',
                  '@group': 'information',
                  '@id': 'e4a2c1763dab9019',
                  '@index':1,
                  '@name': 'data_source',
                  '@uom': 'unitless',
                  '@value': 'Sfc-Wx Configuration'
                },
                {
                  '@def_id': 'e693b707b7de4128',
                  '@group': 'information',
                  '@id': 'cd5a4533af6fb042',
                  '@index':1,
                  '@name': 'writable',
                  '@uom': 'unitless',
                  '@value': 'true'
                }
              ],
              'language':{
                '@name': 'en',
                '@value': 'Campbell Scientific Data Logger Data'
              }
            },
            {
              '@def_id': '435127546c759f09',
              '@group': 'classification',
              '@id': '9b0a6b320a52bdfc',
              '@index':1,
              '@name': 'message_type',
              '@uom': 'unitless',
              '@value':11,
              'element':[
                {
                  '@def_id': '34d3ffec9f3d9862',
                  '@group': 'information',
                  '@id': '8c7727ab81d053a9',
                  '@index':1,
                  '@name': 'data_source',
                  '@uom': 'unitless',
                  '@value': 'JICC'
                },
                {
                  '@def_id': 'f5457b09b6ffa94c',
                  '@group': 'information',
                  '@id': 'f77d29f1efe7bb3c',
                  '@index':1,
                  '@name': 'writable',
                  '@uom': 'unitless',
                  '@value': 'true'
                }
              ]
            },
            {
              '@def_id': 'e132b6483c3f604d',
              '@group': 'classification',
              '@id': '7b9cb278739be6fe',
              '@index':1,
              '@name': 'station_type',
              '@uom': 'unitless',
              '@value': 'F0115',
              'element':[
                {
                  '@def_id': '1310ac12a7c4b52d',
                  '@group': 'information',
                  '@id': '1e79d034ae44a308',
                  '@index':1,
                  '@name': 'data_source',
                  '@uom': 'unitless',
                  '@value': 'SAP'
                },
                {
                  '@def_id': 'ca4e5afc174310c9',
                  '@group': 'information',
                  '@id': '626b47a1f6d8c08a',
                  '@index':1,
                  '@name': 'writable',
                  '@uom': 'unitless',
                  '@value': 'false'
                }
              ],
              'language':[
                {
                  '@name': 'en',
                  '@value': 'SURFACE AUTO STATION'
                },
                {
                  '@name': 'fr',
                  '@value': 'STAT.DE SURFACE AUTO'
                }
              ]
            },
            {
              '@def_id': '8d5322140f61e430',
              '@group': 'classification',
              '@id': 'e1d33b1d68e8043a',
              '@index':1,
              '@name': 'wigos_network_affiliation',
              '@uom': 'unitless',
              '@value': 'Reference Basic Synoptic Stn',
              'element':[
                {
                  '@def_id': 'b6f33da20a5aea01',
                  '@group': 'information',
                  '@id': '5ad88a8c489b5cb8',
                  '@index':1,
                  '@name': 'data_source',
                  '@uom': 'unitless',
                  '@value': 'SAP'
                },
                {
                  '@def_id': '50fee56addb0c39e',
                  '@group': 'information',
                  '@id': 'e5bf6c3894b9e0f5',
                  '@index':1,
                  '@name': 'writable',
                  '@uom': 'unitless',
                  '@value': 'false'
                }
              ]
            },
            {
              '@def_id': '8d5322140f61e430',
              '@group': 'classification',
              '@id': '7200a56d434722de',
              '@index':2,
              '@name': 'wigos_network_affiliation',
              '@uom': 'unitless',
              '@value': 'Reference Climate Station',
              'element':[
                {
                  '@def_id': 'b6f33da20a5aea01',
                  '@group': 'information',
                  '@id': 'ca4eaee2a819ce9',
                  '@index':1,
                  '@name': 'data_source',
                  '@uom': 'unitless',
                  '@value': 'SAP'
                },
                {
                  '@def_id': '50fee56addb0c39e',
                  '@group': 'information',
                  '@id': '6729681b533dbb0',
                  '@index':1,
                  '@name': 'writable',
                  '@uom': 'unitless',
                  '@value': 'false'
                }
              ]
            },
            {
              '@def_id': 'db87ece23e568914',
              '@group': 'collection',
              '@id': '11ee3f2b025d43be',
              '@index':1,
              '@name': 'collection_method',
              '@uom': 'unitless',
              '@value': 'Operator is a machine',
              'element':[
                {
                  '@def_id': 'ebfd666ae68b9ce0',
                  '@group': 'information',
                  '@id': '63f81ec75009440',
                  '@index':1,
                  '@name': 'data_source',
                  '@uom': 'unitless',
                  '@value': 'SAP'
                },
                {
                  '@def_id': 'e35485eb8ce4c9b5',
                  '@group': 'information',
                  '@id': 'bc3bf47a330c2008',
                  '@index':1,
                  '@name': 'writable',
                  '@uom': 'unitless',
                  '@value': 'false'
                }
              ]
            },
            {
              '@def_id': '22b75dabf834140c',
              '@group': 'collection',
              '@id': '35b858c7a31b418',
              '@index':1,
              '@name': 'collection_type',
              '@uom': 'unitless',
              '@value': 'MSC datalogger',
              'element':[
                {
                  '@def_id': 'ac4b01d645d63761',
                  '@group': 'information',
                  '@id': 'c520b8beb0709832',
                  '@index':1,
                  '@name': 'data_source',
                  '@uom': 'unitless',
                  '@value': 'SAP'
                },
                {
                  '@def_id': 'e3ea99907885ef74',
                  '@group': 'information',
                  '@id': '9a10e0e61d3e354c',
                  '@index':1,
                  '@name': 'writable',
                  '@uom': 'unitless',
                  '@value': 'false'
                }
              ]
            },
            {
              '@def_id': '9759b9790ef37718',
              '@group': 'identification',
              '@id': 'f2b5ccc46253e731',
              '@index':1,
              '@name': 'climate_identifier',
              '@uom': 'unitless',
              '@value':1017099,
              'element':[
                {
                  '@def_id': 'aae2955ec32d4a77',
                  '@group': 'information',
                  '@id': '93fc3c9323c32394',
                  '@index':1,
                  '@name': 'data_source',
                  '@uom': 'unitless',
                  '@value': 'SAP'
                },
                {
                  '@def_id': '807b9c022d59d08d',
                  '@group': 'information',
                  '@id': '7b269c6887f424dd',
                  '@index':1,
                  '@name': 'writable',
                  '@uom': 'unitless',
                  '@value': 'false'
                }
              ]
            },
            {
              '@def_id': 'a2c26552362ee7dd',
              '@group': 'identification',
              '@id': '5e138434e9915b60',
              '@index':1,
              '@name': 'msc_identifier',
              '@uom': 'unitless',
              '@value':1017099,
              'element':[
                {
                  '@def_id': 'ba5816d6759f82d9',
                  '@group': 'information',
                  '@id': '6d593337786af3fe',
                  '@index':1,
                  '@name': 'data_source',
                  '@uom': 'unitless',
                  '@value': 'Sfc-Wx Configuration'
                },
                {
                  '@def_id': '785dd769ba3ba0e3',
                  '@group': 'information',
                  '@id': '1c71321b4d561a69',
                  '@index':1,
                  '@name': 'writable',
                  '@uom': 'unitless',
                  '@value': 'false'
                }
              ]
            },
            {
              '@def_id': 'de3c4548e220e30b',
              '@group': 'identification',
              '@id': '618ed418285b71e5',
              '@index':1,
              '@name': 'station_identifier',
              '@uom': 'unitless',
              '@value': 'VTS',
              'element':[
                {
                  '@def_id': '9d2beeb49dfc5c9',
                  '@group': 'information',
                  '@id': '6ad99a5ffef8a38f',
                  '@index':1,
                  '@name': 'data_source',
                  '@uom': 'unitless',
                  '@value': 'SAP'
                },
                {
                  '@def_id': '30de7e1fc44f9867',
                  '@group': 'information',
                  '@id': '7216439008da9733',
                  '@index':1,
                  '@name': 'writable',
                  '@uom': 'unitless',
                  '@value': 'false'
                }
              ]
            },
            {
              '@def_id': 'aae824b36ce3a82a',
              '@group': 'identification',
              '@id': 'cd5308eb2d4f47b',
              '@index':1,
              '@name': 'station_identifier_in',
              '@uom': 'unitless',
              '@value': 'VTS',
              'element':[
                {
                  '@def_id': '75812e65d9069865',
                  '@group': 'information',
                  '@id': '354c2ad9778204ad',
                  '@index':1,
                  '@name': 'data_source',
                  '@uom': 'unitless',
                  '@value': 'Sfc-Wx Configuration'
                },
                {
                  '@def_id': '6510d35a2e6bd321',
                  '@group': 'information',
                  '@id': 'f43a4a810d396d50',
                  '@index':1,
                  '@name': 'writable',
                  '@uom': 'unitless',
                  '@value': 'true'
                }
              ]
            },
            {
              '@def_id': 'e47308bbacbba26b',
              '@group': 'identification',
              '@id': '51d041b357308e4b',
              '@index':1,
              '@name': 'wmo_identifier',
              '@uom': 'unitless',
              '@value':71914,
              'element':[
                {
                  '@def_id': '4c95ffce9a0905b5',
                  '@group': 'information',
                  '@id': 'f5defdb93106d8b4',
                  '@index':1,
                  '@name': 'data_source',
                  '@uom': 'unitless',
                  '@value': 'SAP'
                },
                {
                  '@def_id': 'bb6b2bd713eaed67',
                  '@group': 'information',
                  '@id': 'a1bd0d854fef0b5b',
                  '@index':1,
                  '@name': 'writable',
                  '@uom': 'unitless',
                  '@value': 'false'
                }
              ]
            },
            {
              '@def_id': 'f75ad33f177233f0',
              '@group': 'information',
              '@id': '20ec821a4200fd86',
              '@index':1,
              '@name': 'altimeter',
              '@uom': 'unitless',
              '@value': 'suppress',
              'element':[
                {
                  '@def_id': '15b543dd4e5d92b8',
                  '@group': 'information',
                  '@id': '725d7e26a9c2bc87',
                  '@index':1,
                  '@name': 'data_source',
                  '@uom': 'unitless',
                  '@value': 'JICC'
                },
                {
                  '@def_id': '69d08147b7459f22',
                  '@group': 'information',
                  '@id': '77ed9ced1fe7abac',
                  '@index':1,
                  '@name': 'writable',
                  '@uom': 'unitless',
                  '@value': 'true'
                }
              ]
            },
            {
              '@def_id': '952eba76e3d3156a',
              '@group': 'information',
              '@id': 'edfc7bbfaa9a6122',
              '@index':1,
              '@name': 'config',
              '@uom': 'unitless',
              '@value': 'false',
              'element':[
                {
                  '@def_id': '92318e347ce2e8b8',
                  '@group': 'information',
                  '@id': '1d9a8b87e670b1c4',
                  '@index':1,
                  '@name': 'data_source',
                  '@uom': 'unitless',
                  '@value': 'JICC'
                },
                {
                  '@def_id': '4f63d33b7899f3be',
                  '@group': 'information',
                  '@id': '4ef9715519a7db4f',
                  '@index':1,
                  '@name': 'writable',
                  '@uom': 'unitless',
                  '@value': 'true'
                }
              ]
            },
            {
              '@def_id': '3b9601cec651dfc4',
              '@group': 'information',
              '@id': 'b412d5d964f7ab1c',
              '@index':1,
              '@name': 'data_provider',
              '@uom': 'unitless',
              '@value': 'MSC',
              'element':[
                {
                  '@def_id': '8a9ade6e832fe19a',
                  '@group': 'information',
                  '@id': 'fe287668c6546fea',
                  '@index':1,
                  '@name': 'data_source',
                  '@uom': 'unitless',
                  '@value': 'Sfc-Wx Configuration'
                },
                {
                  '@def_id': 'f03c163bb4486730',
                  '@group': 'information',
                  '@id': '2f7d10a42edf624',
                  '@index':1,
                  '@name': 'writable',
                  '@uom': 'unitless',
                  '@value': 'true'
                }
              ],
              'language':[
                {
                  '@name': 'en',
                  '@value': 'Meteorological Service of Canada'
                },
                {
                  '@name': 'fr',
                  '@value': 'Service m\u00E9t\u00E9orologique du Canada'
                }
              ]
            },
            {
              '@def_id': 'd53f6b11cc210b3c',
              '@group': 'information',
              '@id': '802a94e636bf8956',
              '@index':1,
              '@name': 'goes_address',
              '@uom': 'unitless',
              '@value': 'N\/A',
              'element':[
                {
                  '@def_id': '8872a2e8c911d2f8',
                  '@group': 'information',
                  '@id': '7864160929e45616',
                  '@index':1,
                  '@name': 'data_source',
                  '@uom': 'unitless',
                  '@value': 'JICC'
                },
                {
                  '@def_id': 'fbec8824d72129c8',
                  '@group': 'information',
                  '@id': '344d609199f87cdd',
                  '@index':1,
                  '@name': 'writable',
                  '@uom': 'unitless',
                  '@value': 'true'
                }
              ]
            },
            {
              '@def_id': 'd2cc334172fb8ba2',
              '@group': 'information',
              '@id': '1cda560a5f595e73',
              '@index':1,
              '@name': 'indicator',
              '@uom': 'unitless',
              '@value': 'auto',
              'element':[
                {
                  '@def_id': '77a1dfbe0fca6af8',
                  '@group': 'information',
                  '@id': '23746e35ea9c6962',
                  '@index':1,
                  '@name': 'data_source',
                  '@uom': 'unitless',
                  '@value': 'JICC'
                },
                {
                  '@def_id': '6c3a92cf63d9585f',
                  '@group': 'information',
                  '@id': 'b7fd921699b3ed4c',
                  '@index': 1,
                  '@name': 'writable',
                  '@uom': 'unitless',
                  '@value': 'true'
                }
              ]
            },
            {
              '@def_id': 'f2c3cbf3720bf97',
              '@group': 'information',
              '@id': 'a936e5eeda9690e3',
              '@index': 1,
              '@name': 'station_name',
              '@uom': 'unitless',
              'element': [
                {
                  '@def_id': '98a9f2099525eeb1',
                  '@group': 'information',
                  '@id': '9088acdb5432e169',
                  '@index': 1,
                  '@name': 'data_source',
                  '@uom': 'unitless',
                  '@value': 'SAP'
                },
                {
                  '@def_id': '24691412cd127801',
                  '@group': 'information',
                  '@id': 'a3cec289af040246',
                  '@index': 1,
                  '@name': 'writable',
                  '@uom': 'unitless',
                  '@value': 'false'
                }
              ],
              'language':[
                {
                  '@name': 'en',
                  '@value': 'SATURNA CAPMON'
                },
                {
                  '@name': 'fr',
                  '@value': 'SATURNA CAPMON'
                }
              ]
            },
            {
              '@def_id': '1ffab5d74f9daf43',
              '@group': 'information',
              '@id': '5008f3c3cb9e7464',
              '@index':1,
              '@name': 'syno_prod_table',
              '@uom': 'unitless',
              '@value':11,
              'element':[
                {
                  '@def_id': '6097a8cb05cbdd6d',
                  '@group': 'information',
                  '@id': 'c2a1b51581061910',
                  '@index':1,
                  '@name': 'data_source',
                  '@uom': 'unitless',
                  '@value': 'JICC'
                },
                {
                  '@def_id': 'e13dc9f3bd6c66ee',
                  '@group': 'information',
                  '@id': '93e0607e3c49f81a',
                  '@index':1,
                  '@name': 'writable',
                  '@uom': 'unitless',
                  '@value': 'true'
                }
              ]
            },
            {
              '@def_id': '6dcc9ed965088121',
              '@group': 'information',
              '@id': '9817c6f7d43e6d30',
              '@index':1,
              '@name': 'test_mode',
              '@uom': 'unitless',
              '@value': 'false',
              'element':[
                {
                  '@def_id': 'add3646ac30feff2',
                  '@group': 'information',
                  '@id': 'fc3423ab42b70550',
                  '@index':1,
                  '@name': 'data_source',
                  '@uom': 'unitless',
                  '@value': 'JICC'
                },
                {
                  '@def_id': 'd0a0006870580f86',
                  '@group': 'information',
                  '@id': '5fb530afa92059a0',
                  '@index':1,
                  '@name': 'writable',
                  '@uom': 'unitless',
                  '@value': 'true'
                }
              ]
            },
            {
              '@def_id': 'e165002cf49436f8',
              '@group': 'information',
              '@id': 'c49b601c907f5528',
              '@index':1,
              '@name': 'tso',
              '@uom': 'unitless',
              '@value': 'AM-PY10',
              'element':[
                {
                  '@def_id': '632455bc458c8dad',
                  '@group': 'information',
                  '@id': '9becdc1eb7a19204',
                  '@index':1,
                  '@name': 'data_source',
                  '@uom': 'unitless',
                  '@value': 'SAP'
                },
                {
                  '@def_id': 'dd74360d2ce308d9',
                  '@group': 'information',
                  '@id': '393533c07d8066ae',
                  '@index':1,
                  '@name': 'writable',
                  '@uom': 'unitless',
                  '@value': 'false'
                }
              ],
              'language':[
                {
                  '@name': 'en',
                  '@value': 'Atmospheric Monitoring, Richmond'
                },
                {
                  '@name': 'fr',
                  '@value': 'Surveillance atmosph\u00E9rique, Richmond'
                }
              ]
            },
            {
              '@def_id': 'b8c56820e9e3a376',
              '@group': 'location',
              '@id': 'dcc7e3380f12d425',
              '@index':1,
              '@name': 'barometer_elevation',
              '@uom': 'm',
              '@value':182.0,
              'element':[
                {
                  '@def_id': '9bf6890719501883',
                  '@group': 'information',
                  '@id': 'd731997433e76b0f',
                  '@index':1,
                  '@name': 'data_source',
                  '@uom': 'unitless',
                  '@value': 'JICC'
                },
                {
                  '@def_id': 'ca67566ed2558695',
                  '@group': 'information',
                  '@id': 'b9ba4dccc0d5b794',
                  '@index':1,
                  '@name': 'writable',
                  '@uom': 'unitless',
                  '@value': 'true'
                }
              ]
            },
            {
              '@def_id': '4a1c38c3abbb1c8e',
              '@group': 'location',
              '@id': 'c7d27ad55efabfaf',
              '@index':1,
              '@name': 'coordinate_source',
              '@uom': 'unitless',
              '@value': 'Unknown',
              'element':[
                {
                  '@def_id': '4e96146fa34a5425',
                  '@group': 'information',
                  '@id': '853df55564655114',
                  '@index':1,
                  '@name': 'data_source',
                  '@uom': 'unitless',
                  '@value': 'SAP'
                },
                {
                  '@def_id': 'e1452602411e6f66',
                  '@group': 'information',
                  '@id': '3bb4ad23b94176d0',
                  '@index':1,
                  '@name': 'writable',
                  '@uom': 'unitless',
                  '@value': 'false'
                }
              ]
            },
            {
              '@def_id': 'f7cc8a591d5e74cd',
              '@group': 'location',
              '@id': '306918327be057fb',
              '@index':1,
              '@name': 'coordinate_system',
              '@uom': 'unitless',
              '@value': 'Unknown',
              'element':[
                {
                  '@def_id': 'a35a8d96d16bb808',
                  '@group': 'information',
                  '@id': '7f430a254df08f7c',
                  '@index':1,
                  '@name': 'data_source',
                  '@uom': 'unitless',
                  '@value': 'SAP'
                },
                {
                  '@def_id': '353dbceaa3a02c39',
                  '@group': 'information',
                  '@id': 'df714bb0c9985567',
                  '@index':1,
                  '@name': 'writable',
                  '@uom': 'unitless',
                  '@value': 'false'
                }
              ]
            },
            {
              '@def_id': '3f36ce493f9afc79',
              '@group': 'location',
              '@id': '1bd6a91b25ae8f2b',
              '@index':1,
              '@name': 'country',
              '@uom': 'unitless',
              '@value': 'CA',
              'element':[
                {
                  '@def_id': '1302695ad6ec3ecf',
                  '@group': 'information',
                  '@id': '751e3ef5c7e16aa9',
                  '@index':1,
                  '@name': 'data_source',
                  '@uom': 'unitless',
                  '@value': 'SAP'
                },
                {
                  '@def_id': 'ce38cc4ee850b28a',
                  '@group': 'information',
                  '@id': '3f08b770023ba80b',
                  '@index':1,
                  '@name': 'writable',
                  '@uom': 'unitless',
                  '@value': 'false'
                }
              ]
            },
            {
              '@def_id': 'aec1987370376c8f',
              '@group': 'location',
              '@id': '5b203d5ad9c9902a',
              '@index':1,
              '@name': 'geopotential_barometer_elevation',
              '@uom': 'm',
              '@value':182.0486391655215118426090360582088
            },
            {
              '@def_id': '9f89ccf8823bdc0c',
              '@group': 'location',
              '@id': '4ce7feab3760ee01',
              '@index':1,
              '@name': 'geopotential_station_elevation',
              '@uom': 'm',
              '@value':178.0478176108552710857027135555134
            },
            {
              '@def_id': '6a8a9a48f7a0dedd',
              '@group': 'location',
              '@id': '3672a88de960cf3b',
              '@index':1,
              '@name': 'latitude',
              '@uom': 'unitless',
              '@value':48.775,
              'element':[
                {
                  '@def_id': 'c4764588ede0a969',
                  '@group': 'information',
                  '@id': '96d609bcae35593a',
                  '@index':1,
                  '@name': 'data_source',
                  '@uom': 'unitless',
                  '@value': 'SAP'
                },
                {
                  '@def_id': '6a18f48556a02096',
                  '@group': 'information',
                  '@id': '613e122846562961',
                  '@index':1,
                  '@name': 'writable',
                  '@uom': 'unitless',
                  '@value': 'false'
                }
              ]
            },
            {
              '@def_id': 'dceeb512fac88a7',
              '@group': 'location',
              '@id': 'b2dc5eae10412deb',
              '@index':1,
              '@name': 'latitude_degrees',
              '@uom': '\u00B0',
              '@value':48,
              'element':[
                {
                  '@def_id': 'a4384007e39b2e45',
                  '@group': 'information',
                  '@id': 'dca64bde1e1a0b6c',
                  '@index':1,
                  '@name': 'data_source',
                  '@uom': 'unitless',
                  '@value': 'SAP'
                },
                {
                  '@def_id': 'bd1970c5b4be9bbe',
                  '@group': 'information',
                  '@id': 'c359b66e545ebe60',
                  '@index':1,
                  '@name': 'writable',
                  '@uom': 'unitless',
                  '@value': 'false'
                }
              ]
            },
            {
              '@def_id': '719589594dcd84a3',
              '@group': 'location',
              '@id': '149515f04d3b4f2c',
              '@index': 1,
              '@name': 'latitude_minutes',
              '@uom': 'degrees',
              '@value': 46,
              'element': [
                {
                  '@def_id': '5b21c631878d88b1',
                  '@group': 'information',
                  '@id': '1b650f63ec500e11',
                  '@index':1,
                  '@name': 'data_source',
                  '@uom': 'unitless',
                  '@value': 'SAP'
                },
                {
                  '@def_id': '23c89ae113c6ba09',
                  '@group': 'information',
                  '@id': 'b71a13faa13221db',
                  '@index':1,
                  '@name': 'writable',
                  '@uom': 'unitless',
                  '@value': 'false'
                }
              ]
            },
            {
              '@def_id': '666cfb5e9821c876',
              '@group': 'location',
              '@id': '5e50d916dbac96cd',
              '@index':1,
              '@name': 'latitude_seconds',
              '@uom': 'degrees',
              '@value':30,
              'element':[
                {
                  '@def_id': '640c5ebb2d62c700',
                  '@group': 'information',
                  '@id': '7a8d8c051c6bc6b6',
                  '@index':1,
                  '@name': 'data_source',
                  '@uom': 'unitless',
                  '@value': 'SAP'
                },
                {
                  '@def_id': '8acb2c1e437d492a',
                  '@group': 'information',
                  '@id': '24edf4a3cc733bc',
                  '@index':1,
                  '@name': 'writable',
                  '@uom': 'unitless',
                  '@value': 'false'
                }
              ]
            },
            {
              '@def_id': 'b3582eecfc453323',
              '@group': 'location',
              '@id': 'c6801f300d4a8e1d',
              '@index':1,
              '@name': 'longitude',
              '@uom': 'unitless',
              '@value':-123.1281,
              'element':[
                {
                  '@def_id': '53945da1b14b1c6f',
                  '@group': 'information',
                  '@id': '4d0ac0c86f3a4c88',
                  '@index':1,
                  '@name': 'data_source',
                  '@uom': 'unitless',
                  '@value': 'SAP'
                },
                {
                  '@def_id': 'b6bd4fe8e97e7b6f',
                  '@group': 'information',
                  '@id': 'b0ae05efffc7ce79',
                  '@index':1,
                  '@name': 'writable',
                  '@uom': 'unitless',
                  '@value': 'false'
                }
              ]
            },
            {
              '@def_id': '8c462ab4e153789a',
              '@group': 'location',
              '@id': '68b23c2cdd74bc31',
              '@index':1,
              '@name': 'longitude_degrees',
              '@uom': '\u00B0',
              '@value':-123,
              'element':[
                {
                  '@def_id': '4f5f343222fb8f4c',
                  '@group': 'information',
                  '@id': '98bb6baa484f3f3b',
                  '@index':1,
                  '@name': 'data_source',
                  '@uom': 'unitless',
                  '@value': 'SAP'
                },
                {
                  '@def_id': 'f3d9684e09b00c11',
                  '@group': 'information',
                  '@id': 'e0f9b2e946628865',
                  '@index':1,
                  '@name': 'writable',
                  '@uom': 'unitless',
                  '@value': 'false'
                }
              ]
            },
            {
              '@def_id': '34b07a8c3e1adf38',
              '@group': 'location',
              '@id': '30e02ec76c9f89e6',
              '@index':1,
              '@name': 'longitude_minutes',
              '@uom': '\'',
              '@value':7,
              'element':[
                {
                  '@def_id': '8c4d2b80fb83e6c8',
                  '@group': 'information',
                  '@id': '413f7bb3fdf18b62',
                  '@index':1,
                  '@name': 'data_source',
                  '@uom': 'unitless',
                  '@value': 'SAP'
                },
                {
                  '@def_id': 'f0c1bb261de6383e',
                  '@group': 'information',
                  '@id': '959d05fbe06d61be',
                  '@index':1,
                  '@name': 'writable',
                  '@uom': 'unitless',
                  '@value': 'false'
                }
              ]
            },
            {
              '@def_id': '34bdbbaa50e3b2f5',
              '@group': 'location',
              '@id': 'c0b3410a1fef5900',
              '@index':1,
              '@name': 'longitude_seconds',
              '@uom': '\'',
              '@value':41,
              'element':[
                {
                  '@def_id': 'adcf03c53f9bab24',
                  '@group': 'information',
                  '@id': 'edf8b3afd8a3d137',
                  '@index':1,
                  '@name': 'data_source',
                  '@uom': 'unitless',
                  '@value': 'SAP'
                },
                {
                  '@def_id': 'd89431d12f6d4328',
                  '@group': 'information',
                  '@id': '93cb7cea793b483d',
                  '@index':1,
                  '@name': 'writable',
                  '@uom': 'unitless',
                  '@value': 'false'
                }
              ]
            },
            {
              '@def_id': 'b117e3ec9fd100cb',
              '@group': 'location',
              '@id': '26b717d883975377',
              '@index':1,
              '@name': 'province',
              '@uom': 'unitless',
              '@value': 'BC',
              'element':[
                {
                  '@def_id': '18ac788ba02484d1',
                  '@group': 'information',
                  '@id': '3b90153600b0138f',
                  '@index':1,
                  '@name': 'data_source',
                  '@uom': 'unitless',
                  '@value': 'SAP'
                },
                {
                  '@def_id': 'c43342300a56ba46',
                  '@group': 'information',
                  '@id': 'bb741dd03be572ea',
                  '@index':1,
                  '@name': 'writable',
                  '@uom': 'unitless',
                  '@value': 'false'
                }
              ],
              'language':[
                {
                  '@name': 'en',
                  '@value': 'BRITISH COLUMBIA'
                },
                {
                  '@name': 'fr',
                  '@value': 'COLOMBIE-BRITANNIQUE'
                }
              ]
            },
            {
              '@def_id': '83d791fc72c356eb',
              '@group': 'location',
              '@id': '85a81011eb3ef468',
              '@index':1,
              '@name': 'station_elevation',
              '@uom': 'm',
              '@value':178.000,
              'element':[
                {
                  '@def_id': 'aba57596cc0a1962',
                  '@group': 'information',
                  '@id': 'b774ded75412583f',
                  '@index':1,
                  '@name': 'data_source',
                  '@uom': 'unitless',
                  '@value': 'SAP'
                },
                {
                  '@def_id': '225fa00959173e90',
                  '@group': 'information',
                  '@id': '93ab6dd2876a3327',
                  '@index':1,
                  '@name': 'writable',
                  '@uom': 'unitless',
                  '@value': 'false'
                }
              ]
            },
            {
              '@def_id': 'f11b5e53e0405aea',
              '@group': 'location',
              '@id': 'bd5a86e76b47faa5',
              '@index':1,
              '@name': 'station_elevation_source',
              '@uom': 'unitless',
              '@value': 'Unknown',
              'element':[
                {
                  '@def_id': '892ef917c5c96356',
                  '@group': 'information',
                  '@id': 'f4611650acec4a3c',
                  '@index':1,
                  '@name': 'data_source',
                  '@uom': 'unitless',
                  '@value': 'SAP'
                },
                {
                  '@def_id': '7a50d4886310f421',
                  '@group': 'information',
                  '@id': '9472fb44ee1ac7eb',
                  '@index':1,
                  '@name': 'writable',
                  '@uom': 'unitless',
                  '@value': 'false'
                }
              ]
            },
            {
              '@def_id': '9f6506ca9be39095',
              '@group': 'location',
              '@id': '3bfaeb08cc9bd556',
              '@index':1,
              '@name': 'station_elevation_type',
              '@uom': 'unitless',
              '@value': 'Unknown',
              'element':[
                {
                  '@def_id': '69a45572952d7768',
                  '@group': 'information',
                  '@id': 'd78e6ae4883f3e1f',
                  '@index':1,
                  '@name': 'data_source',
                  '@uom': 'unitless',
                  '@value': 'SAP'
                },
                {
                  '@def_id': 'e57e5b2cf0147ad5',
                  '@group': 'information',
                  '@id': 'a70ccee5db150295',
                  '@index':1,
                  '@name': 'writable',
                  '@uom': 'unitless',
                  '@value': 'false'
                }
              ]
            },
            {
              '@def_id': 'e12cc7418b6ab3fc',
              '@group': 'maintenance',
              '@id': 'b76054b7bbc09397',
              '@index':1,
              '@name': 'inspection_interval',
              '@uom': 'unitless',
              '@value': 'Inspected every 6 months',
              'element':[
                {
                  '@def_id': '6fafeefe41680392',
                  '@group': 'information',
                  '@id': 'c23791cf022a8fd1',
                  '@index':1,
                  '@name': 'data_source',
                  '@uom': 'unitless',
                  '@value': 'SAP'
                },
                {
                  '@def_id': '1c39668ab2bf3c20',
                  '@group': 'information',
                  '@id': '8b5a7add998f04c7',
                  '@index':1,
                  '@name': 'writable',
                  '@uom': 'unitless',
                  '@value': 'false'
                }
              ]
            },
            {
              '@def_id': 'bae74ab89d316e36',
              '@group': 'msl_pressure_reduction_coefficients',
              '@id': '1d977278d408bd77',
              '@index':1,
              '@name': 'coefficient',
              '@uom': 'unitless',
              '@value':-0.002792,
              'element':[
                {
                  '@def_id': 'f7291e54f53850fc',
                  '@group': 'information',
                  '@id': 'c7be4229b5939f1f',
                  '@index':1,
                  '@name': 'data_source',
                  '@uom': 'unitless',
                  '@value': 'JICC'
                },
                {
                  '@def_id': 'd4f2ba7abb24b53f',
                  '@group': 'information',
                  '@id': 'a8782241be75b7c6',
                  '@index':1,
                  '@name': 'writable',
                  '@uom': 'unitless',
                  '@value': 'true'
                }
              ]
            },
            {
              '@def_id': 'bae74ab89d316e36',
              '@group': 'msl_pressure_reduction_coefficients',
              '@id': '51305224b5e2584f',
              '@index':2,
              '@name': 'coefficient',
              '@uom': 'unitless',
              '@value':-0.440544,
              'element':[
                {
                  '@def_id': 'f7291e54f53850fc',
                  '@group': 'information',
                  '@id': 'd2b628d9a6f8fa2b',
                  '@index':1,
                  '@name': 'data_source',
                  '@uom': 'unitless',
                  '@value': 'JICC'
                },
                {
                  '@def_id': 'd4f2ba7abb24b53f',
                  '@group': 'information',
                  '@id': 'df9bdf2f83ff6d6f',
                  '@index':1,
                  '@name': 'writable',
                  '@uom': 'unitless',
                  '@value': 'true'
                }
              ]
            },
            {
              '@def_id': 'bae74ab89d316e36',
              '@group': 'msl_pressure_reduction_coefficients',
              '@id': '28ea71fe41523868',
              '@index':3,
              '@name': 'coefficient',
              '@uom': 'unitless',
              '@value':4.60506,
              'element':[
                {
                  '@def_id': 'f7291e54f53850fc',
                  '@group': 'information',
                  '@id': 'c98bc41409e33581',
                  '@index':1,
                  '@name': 'data_source',
                  '@uom': 'unitless',
                  '@value': 'JICC'
                },
                {
                  '@def_id': 'd4f2ba7abb24b53f',
                  '@group': 'information',
                  '@id': '9c093526302f4e32',
                  '@index':1,
                  '@name': 'writable',
                  '@uom': 'unitless',
                  '@value': 'true'
                }
              ]
            },
            {
              '@def_id': 'a6192a3339ebd5b7',
              '@group': 'ownership',
              '@id': '7cf9c5ed5a4ad797',
              '@index':1,
              '@name': 'equipment_ownership',
              '@uom': 'unitless',
              '@value': 'EC owns all equipment',
              'element':[
                {
                  '@def_id': 'ada598b23a5a5df5',
                  '@group': 'information',
                  '@id': 'ce3b3d1d94b58c43',
                  '@index':1,
                  '@name': 'data_source',
                  '@uom': 'unitless',
                  '@value': 'SAP'
                },
                {
                  '@def_id': '1ba2566958d8655e',
                  '@group': 'information',
                  '@id': 'c4b4eb4edbd6e633',
                  '@index':1,
                  '@name': 'writable',
                  '@uom': 'unitless',
                  '@value': 'false'
                }
              ]
            },
            {
              '@def_id': '8bee32f93501c61c',
              '@group': 'ownership',
              '@id': '1d24dcc029e50c9f',
              '@index':1,
              '@name': 'land_ownership',
              '@uom': 'unitless',
              '@value': 'No cost to department',
              'element':[
                {
                  '@def_id': '790321ab1ede1e85',
                  '@group': 'information',
                  '@id': 'b2683a93ecbcfea8',
                  '@index':1,
                  '@name': 'data_source',
                  '@uom': 'unitless',
                  '@value': 'SAP'
                },
                {
                  '@def_id': '247199522b69fc4d',
                  '@group': 'information',
                  '@id': '9e4653870f709301',
                  '@index':1,
                  '@name': 'writable',
                  '@uom': 'unitless',
                  '@value': 'false'
                }
              ]
            },
            {
              '@def_id': 'c8f6fbb063661e61',
              '@group': 'snow_mean_temperature',
              '@id': '6796dd1e364402c1',
              '@index':1,
              '@name': 'max',
              '@uom': '\u00B0C',
              '@value':99.0,
              'element':[
                {
                  '@def_id': '587cedb1ca82313',
                  '@group': 'information',
                  '@id': '8f3e901f3b9ac60d',
                  '@index':1,
                  '@name': 'data_source',
                  '@uom': 'unitless',
                  '@value': 'JICC'
                },
                {
                  '@def_id': 'd2c56668a9cb9daf',
                  '@group': 'information',
                  '@id': '3b51bca312494d3d',
                  '@index':1,
                  '@name': 'writable',
                  '@uom': 'unitless',
                  '@value': 'true'
                }
              ]
            },
            {
              '@def_id': 'c9ae6c5d61dad7c7',
              '@group': 'snow_mean_temperature',
              '@id': '43b1760a5bdcb28c',
              '@index':1,
              '@name': 'min',
              '@uom': '\u00B0C',
              '@value':90.0,
              'element':[
                {
                  '@def_id': '76c32a5d678186b9',
                  '@group': 'information',
                  '@id': '747e4c542b0ca2aa',
                  '@index':1,
                  '@name': 'data_source',
                  '@uom': 'unitless',
                  '@value': 'JICC'
                },
                {
                  '@def_id': 'a40d82aab1c0e1ae',
                  '@group': 'information',
                  '@id': 'c65b958232cb43c5',
                  '@index':1,
                  '@name': 'writable',
                  '@uom': 'unitless',
                  '@value': 'true'
                }
              ]
            },
            {
              '@def_id': '5b83921ec27d3f89',
              '@group': 'snow_mean_temperature',
              '@id': '5fa2f74ed36852f9',
              '@index':1,
              '@name': 'usage',
              '@uom': 'unitless',
              '@value': 'true',
              'element':[
                {
                  '@def_id': '888c4e79beaea111',
                  '@group': 'information',
                  '@id': '8c2b86dcdfb96773',
                  '@index':1,
                  '@name': 'data_source',
                  '@uom': 'unitless',
                  '@value': 'JICC'
                },
                {
                  '@def_id': 'd57fbdf4ff5c77e6',
                  '@group': 'information',
                  '@id': '13f085aa5e2f425',
                  '@index':1,
                  '@name': 'writable',
                  '@uom': 'unitless',
                  '@value': 'true'
                }
              ]
            },
            {
              '@def_id': 'a991e80cc82efa28',
              '@group': 'status',
              '@id': '50a12bbfd23f9ed9',
              '@index':1,
              '@name': 'station_status',
              '@uom': 'unitless',
              '@value': 'In Service',
              'element':[
                {
                  '@def_id': '52895b502e86ab5c',
                  '@group': 'information',
                  '@id': '24b02fd6030b45c2',
                  '@index':1,
                  '@name': 'data_source',
                  '@uom': 'unitless',
                  '@value': 'SAP'
                },
                {
                  '@def_id': '1bacbf70347c60ba',
                  '@group': 'information',
                  '@id': '93adb2ad04839e7a',
                  '@index':1,
                  '@name': 'writable',
                  '@uom': 'unitless',
                  '@value': 'false'
                }
              ]
            },
            {
              '@def_id': '6ad6cf2adf2f9f8b',
              '@group': 'status',
              '@id': '81db40c86d05ba2d',
              '@index':1,
              '@name': 'station_system_status',
              '@uom': 'unitless',
              '@value': 'CRTE',
              'element':[
                {
                  '@def_id': '836ccacb3cf067af',
                  '@group': 'information',
                  '@id': '8270547f0b7173e2',
                  '@index':1,
                  '@name': 'data_source',
                  '@uom': 'unitless',
                  '@value': 'SAP'
                },
                {
                  '@def_id': '8406ca3dddd199ea',
                  '@group': 'information',
                  '@id': 'f7a18feed4a1958d',
                  '@index':1,
                  '@name': 'writable',
                  '@uom': 'unitless',
                  '@value': 'false'
                }
              ],
              'language':[
                {
                  '@name': 'en',
                  '@value': 'Created'
                },
                {
                  '@name': 'fr',
                  '@value': 'Cr\u00E9\u00E9'
                }
              ]
            },
            {
              '@def_id': 'fb828c1fd619fb90',
              '@group': 'summer_range',
              '@id': '769da9bbcfa61e77',
              '@index':1,
              '@name': 'end_day',
              '@uom': 'unitless',
              '@value':15,
              'element':[
                {
                  '@def_id': 'c672e80afb49f582',
                  '@group': 'information',
                  '@id': 'b31826f6bfe23ca4',
                  '@index':1,
                  '@name': 'data_source',
                  '@uom': 'unitless',
                  '@value': 'JICC'
                },
                {
                  '@def_id': 'eadd45631eedab58',
                  '@group': 'information',
                  '@id': '79d723aba1524fea',
                  '@index':1,
                  '@name': 'writable',
                  '@uom': 'unitless',
                  '@value': 'true'
                }
              ]
            },
            {
              '@def_id': 'fd1add14b3be59fd',
              '@group': 'summer_range',
              '@id': '6c5b9724f5cda602',
              '@index':1,
              '@name': 'end_month',
              '@uom': 'unitless',
              '@value':10,
              'element':[
                {
                  '@def_id': 'fe9e67c49a95c2fa',
                  '@group': 'information',
                  '@id': '67634114c153c0d6',
                  '@index':1,
                  '@name': 'data_source',
                  '@uom': 'unitless',
                  '@value': 'JICC'
                },
                {
                  '@def_id': '6f9d607656cd0cdd',
                  '@group': 'information',
                  '@id': 'e8cf0eedf2267d48',
                  '@index':1,
                  '@name': 'writable',
                  '@uom': 'unitless',
                  '@value': 'true'
                }
              ]
            },
            {
              '@def_id': '4bd6a72ad5e03793',
              '@group': 'summer_range',
              '@id': 'ed7239e6ae890b76',
              '@index':1,
              '@name': 'start_day',
              '@uom': 'unitless',
              '@value':1,
              'element':[
                {
                  '@def_id': '7800f4a2a922ac95',
                  '@group': 'information',
                  '@id': 'c5dd44c5f807f991',
                  '@index':1,
                  '@name': 'data_source',
                  '@uom': 'unitless',
                  '@value': 'JICC'
                },
                {
                  '@def_id': '41f6456584f03c4c',
                  '@group': 'information',
                  '@id': 'abaf8d4bf6e75b7b',
                  '@index':1,
                  '@name': 'writable',
                  '@uom': 'unitless',
                  '@value': 'true'
                }
              ]
            },
            {
              '@def_id': 'e1aff47437fdbdb3',
              '@group': 'summer_range',
              '@id': '9989155dfdfb96fa',
              '@index':1,
              '@name': 'start_month',
              '@uom': 'unitless',
              '@value':4,
              'element':[
                {
                  '@def_id': '988ee50d41fc8c2f',
                  '@group': 'information',
                  '@id': '8d8edb636afc56a1',
                  '@index':1,
                  '@name': 'data_source',
                  '@uom': 'unitless',
                  '@value': 'JICC'
                },
                {
                  '@def_id': '328b2f8c508c33c',
                  '@group': 'information',
                  '@id': '4e5722d0d92c7e14',
                  '@index':1,
                  '@name': 'writable',
                  '@uom': 'unitless',
                  '@value': 'true'
                }
              ]
            },
            {
              '@def_id': 'e262b5f8a121e712',
              '@group': 'synoptic_transmit_hours',
              '@id': '9b5b30a431aaafdc',
              '@index':1,
              '@name': 'hour',
              '@uom': 'unitless',
              '@value': 'true',
              'element':[
                {
                  '@def_id': '49d7ca81db29ae17',
                  '@group': 'information',
                  '@id': 'd6f965c423c7c20c',
                  '@index':1,
                  '@name': 'data_source',
                  '@uom': 'unitless',
                  '@value': 'JICC'
                },
                {
                  '@def_id': '4163f9bbd04b8e90',
                  '@group': 'information',
                  '@id': '7612babc48b65',
                  '@index':1,
                  '@name': 'writable',
                  '@uom': 'unitless',
                  '@value': 'true'
                },
                {
                  '@def_id': 'acebc3b9023386d',
                  '@group': 'synoptic_transmit_hours',
                  '@id': '661445271d634cff',
                  '@index':1,
                  '@name': '@value',
                  '@uom': 'unitless',
                  '@value':0
                }
              ]
            },
            {
              '@def_id': 'e262b5f8a121e712',
              '@group': 'synoptic_transmit_hours',
              '@id': 'f1ef7baf6e30a931',
              '@index':2,
              '@name': 'hour',
              '@uom': 'unitless',
              '@value': 'false',
              'element':[
                {
                  '@def_id': '49d7ca81db29ae17',
                  '@group': 'information',
                  '@id': 'fea3664c1c10de7',
                  '@index':1,
                  '@name': 'data_source',
                  '@uom': 'unitless',
                  '@value': 'JICC'
                },
                {
                  '@def_id': '4163f9bbd04b8e90',
                  '@group': 'information',
                  '@id': 'd8db2aca81299049',
                  '@index':1,
                  '@name': 'writable',
                  '@uom': 'unitless',
                  '@value': 'true'
                },
                {
                  '@def_id': 'acebc3b9023386d',
                  '@group': 'synoptic_transmit_hours',
                  '@id': 'c771442270f89e51',
                  '@index':1,
                  '@name': '@value',
                  '@uom': 'unitless',
                  '@value':1
                }
              ]
            },
            {
              '@def_id': 'e262b5f8a121e712',
              '@group': 'synoptic_transmit_hours',
              '@id': '11280da10c73a85f',
              '@index':3,
              '@name': 'hour',
              '@uom': 'unitless',
              '@value': 'false',
              'element':[
                {
                  '@def_id': '49d7ca81db29ae17',
                  '@group': 'information',
                  '@id': '305a51324ad3d984',
                  '@index':1,
                  '@name': 'data_source',
                  '@uom': 'unitless',
                  '@value': 'JICC'
                },
                {
                  '@def_id': '4163f9bbd04b8e90',
                  '@group': 'information',
                  '@id': 'f66efbb3dddaee31',
                  '@index':1,
                  '@name': 'writable',
                  '@uom': 'unitless',
                  '@value': 'true'
                },
                {
                  '@def_id': 'acebc3b9023386d',
                  '@group': 'synoptic_transmit_hours',
                  '@id': 'ab3d322571778e76',
                  '@index':1,
                  '@name': '@value',
                  '@uom': 'unitless',
                  '@value':2
                }
              ]
            },
            {
              '@def_id': 'e262b5f8a121e712',
              '@group': 'synoptic_transmit_hours',
              '@id': 'a46ea3ec1f53aa3',
              '@index':4,
              '@name': 'hour',
              '@uom': 'unitless',
              '@value': 'false',
              'element':[
                {
                  '@def_id': '49d7ca81db29ae17',
                  '@group': 'information',
                  '@id': 'cfeea260ff532527',
                  '@index':1,
                  '@name': 'data_source',
                  '@uom': 'unitless',
                  '@value': 'JICC'
                },
                {
                  '@def_id': '4163f9bbd04b8e90',
                  '@group': 'information',
                  '@id': '99cdfcb81c4f0d6c',
                  '@index':1,
                  '@name': 'writable',
                  '@uom': 'unitless',
                  '@value': 'true'
                },
                {
                  '@def_id': 'acebc3b9023386d',
                  '@group': 'synoptic_transmit_hours',
                  '@id': '66b3aa664b2bb808',
                  '@index':1,
                  '@name': '@value',
                  '@uom': 'unitless',
                  '@value':3
                }
              ]
            },
            {
              '@def_id': 'e262b5f8a121e712',
              '@group': 'synoptic_transmit_hours',
              '@id': 'e26b749d790a0f7f',
              '@index':5,
              '@name': 'hour',
              '@uom': 'unitless',
              '@value': 'false',
              'element':[
                {
                  '@def_id': '49d7ca81db29ae17',
                  '@group': 'information',
                  '@id': '605f4b6682fd3fd3',
                  '@index':1,
                  '@name': 'data_source',
                  '@uom': 'unitless',
                  '@value': 'JICC'
                },
                {
                  '@def_id': '4163f9bbd04b8e90',
                  '@group': 'information',
                  '@id': 'f663ad88a5e3b999',
                  '@index':1,
                  '@name': 'writable',
                  '@uom': 'unitless',
                  '@value': 'true'
                },
                {
                  '@def_id': 'acebc3b9023386d',
                  '@group': 'synoptic_transmit_hours',
                  '@id': '878c6e2ccae36294',
                  '@index':1,
                  '@name': '@value',
                  '@uom': 'unitless',
                  '@value':4
                }
              ]
            },
            {
              '@def_id': 'e262b5f8a121e712',
              '@group': 'synoptic_transmit_hours',
              '@id': 'ddb00a057382d0c0',
              '@index':6,
              '@name': 'hour',
              '@uom': 'unitless',
              '@value': 'false',
              'element':[
                {
                  '@def_id': '49d7ca81db29ae17',
                  '@group': 'information',
                  '@id': '5be5d4d8ace2932',
                  '@index':1,
                  '@name': 'data_source',
                  '@uom': 'unitless',
                  '@value': 'JICC'
                },
                {
                  '@def_id': '4163f9bbd04b8e90',
                  '@group': 'information',
                  '@id': 'b620a1d87e0e497a',
                  '@index':1,
                  '@name': 'writable',
                  '@uom': 'unitless',
                  '@value': 'true'
                },
                {
                  '@def_id': 'acebc3b9023386d',
                  '@group': 'synoptic_transmit_hours',
                  '@id': 'fc7abd2233b80756',
                  '@index':1,
                  '@name': '@value',
                  '@uom': 'unitless',
                  '@value':5
                }
              ]
            },
            {
              '@def_id': 'e262b5f8a121e712',
              '@group': 'synoptic_transmit_hours',
              '@id': '38d8bcec74f0d67b',
              '@index':7,
              '@name': 'hour',
              '@uom': 'unitless',
              '@value': 'true',
              'element':[
                {
                  '@def_id': '49d7ca81db29ae17',
                  '@group': 'information',
                  '@id': 'c42d92936a1e3ebd',
                  '@index':1,
                  '@name': 'data_source',
                  '@uom': 'unitless',
                  '@value': 'JICC'
                },
                {
                  '@def_id': '4163f9bbd04b8e90',
                  '@group': 'information',
                  '@id': '5c54b9f9c7f7d4f8',
                  '@index':1,
                  '@name': 'writable',
                  '@uom': 'unitless',
                  '@value': 'true'
                },
                {
                  '@def_id': 'acebc3b9023386d',
                  '@group': 'synoptic_transmit_hours',
                  '@id': 'c7723288636351fc',
                  '@index':1,
                  '@name': '@value',
                  '@uom': 'unitless',
                  '@value':6
                }
              ]
            },
            {
              '@def_id': 'e262b5f8a121e712',
              '@group': 'synoptic_transmit_hours',
              '@id': '9756c3f8b70602b7',
              '@index':8,
              '@name': 'hour',
              '@uom': 'unitless',
              '@value': 'false',
              'element':[
                {
                  '@def_id': '49d7ca81db29ae17',
                  '@group': 'information',
                  '@id': 'b4dca98cea01ab3f',
                  '@index':1,
                  '@name': 'data_source',
                  '@uom': 'unitless',
                  '@value': 'JICC'
                },
                {
                  '@def_id': '4163f9bbd04b8e90',
                  '@group': 'information',
                  '@id': '33926dbe4863f4cc',
                  '@index':1,
                  '@name': 'writable',
                  '@uom': 'unitless',
                  '@value': 'true'
                },
                {
                  '@def_id': 'acebc3b9023386d',
                  '@group': 'synoptic_transmit_hours',
                  '@id': '79656bf655d8dfed',
                  '@index':1,
                  '@name': '@value',
                  '@uom': 'unitless',
                  '@value':7
                }
              ]
            },
            {
              '@def_id': 'e262b5f8a121e712',
              '@group': 'synoptic_transmit_hours',
              '@id': '6f6f108f2eb30ede',
              '@index':9,
              '@name': 'hour',
              '@uom': 'unitless',
              '@value': 'false',
              'element':[
                {
                  '@def_id': '49d7ca81db29ae17',
                  '@group': 'information',
                  '@id': '87cff1859d94837f',
                  '@index':1,
                  '@name': 'data_source',
                  '@uom': 'unitless',
                  '@value': 'JICC'
                },
                {
                  '@def_id': '4163f9bbd04b8e90',
                  '@group': 'information',
                  '@id': '24a21bd4d1c74087',
                  '@index':1,
                  '@name': 'writable',
                  '@uom': 'unitless',
                  '@value': 'true'
                },
                {
                  '@def_id': 'acebc3b9023386d',
                  '@group': 'synoptic_transmit_hours',
                  '@id': 'fea6afbf9d3aadd3',
                  '@index':1,
                  '@name': '@value',
                  '@uom': 'unitless',
                  '@value':8
                }
              ]
            },
            {
              '@def_id': 'e262b5f8a121e712',
              '@group': 'synoptic_transmit_hours',
              '@id': '6d6bb771eb5f02c2',
              '@index':10,
              '@name': 'hour',
              '@uom': 'unitless',
              '@value': 'false',
              'element':[
                {
                  '@def_id': '49d7ca81db29ae17',
                  '@group': 'information',
                  '@id': '33876afe8eb872d3',
                  '@index':1,
                  '@name': 'data_source',
                  '@uom': 'unitless',
                  '@value': 'JICC'
                },
                {
                  '@def_id': '4163f9bbd04b8e90',
                  '@group': 'information',
                  '@id': 'ac2500c6e13b49f',
                  '@index':1,
                  '@name': 'writable',
                  '@uom': 'unitless',
                  '@value': 'true'
                },
                {
                  '@def_id': 'acebc3b9023386d',
                  '@group': 'synoptic_transmit_hours',
                  '@id': 'b523aeabd0d7bbb1',
                  '@index':1,
                  '@name': '@value',
                  '@uom': 'unitless',
                  '@value':9
                }
              ]
            },
            {
              '@def_id': 'e262b5f8a121e712',
              '@group': 'synoptic_transmit_hours',
              '@id': '15565d9cdf1297d9',
              '@index':11,
              '@name': 'hour',
              '@uom': 'unitless',
              '@value': 'false',
              'element':[
                {
                  '@def_id': '49d7ca81db29ae17',
                  '@group': 'information',
                  '@id': '56ab74a4598e4340',
                  '@index':1,
                  '@name': 'data_source',
                  '@uom': 'unitless',
                  '@value': 'JICC'
                },
                {
                  '@def_id': '4163f9bbd04b8e90',
                  '@group': 'information',
                  '@id': 'cb805ec5f252bff2',
                  '@index':1,
                  '@name': 'writable',
                  '@uom': 'unitless',
                  '@value': 'true'
                },
                {
                  '@def_id': 'acebc3b9023386d',
                  '@group': 'synoptic_transmit_hours',
                  '@id': '4438945890423bdb',
                  '@index':1,
                  '@name': '@value',
                  '@uom': 'unitless',
                  '@value':10
                }
              ]
            },
            {
              '@def_id': 'e262b5f8a121e712',
              '@group': 'synoptic_transmit_hours',
              '@id': '12526dd8d3713b48',
              '@index':12,
              '@name': 'hour',
              '@uom': 'unitless',
              '@value': 'false',
              'element':[
                {
                  '@def_id': '49d7ca81db29ae17',
                  '@group': 'information',
                  '@id': '123e7914f188ffdc',
                  '@index':1,
                  '@name': 'data_source',
                  '@uom': 'unitless',
                  '@value': 'JICC'
                },
                {
                  '@def_id': '4163f9bbd04b8e90',
                  '@group': 'information',
                  '@id': 'e6fb487492225881',
                  '@index':1,
                  '@name': 'writable',
                  '@uom': 'unitless',
                  '@value': 'true'
                },
                {
                  '@def_id': 'acebc3b9023386d',
                  '@group': 'synoptic_transmit_hours',
                  '@id': 'f4302938209e1bdc',
                  '@index':1,
                  '@name': '@value',
                  '@uom': 'unitless',
                  '@value':11
                }
              ]
            },
            {
              '@def_id': 'e262b5f8a121e712',
              '@group': 'synoptic_transmit_hours',
              '@id': '64f42700a54965e8',
              '@index':13,
              '@name': 'hour',
              '@uom': 'unitless',
              '@value': 'true',
              'element':[
                {
                  '@def_id': '49d7ca81db29ae17',
                  '@group': 'information',
                  '@id': '538d7b0720f2abeb',
                  '@index':1,
                  '@name': 'data_source',
                  '@uom': 'unitless',
                  '@value': 'JICC'
                },
                {
                  '@def_id': '4163f9bbd04b8e90',
                  '@group': 'information',
                  '@id': 'd67df92503899caa',
                  '@index':1,
                  '@name': 'writable',
                  '@uom': 'unitless',
                  '@value': 'true'
                },
                {
                  '@def_id': 'acebc3b9023386d',
                  '@group': 'synoptic_transmit_hours',
                  '@id': 'e6446b044a74e064',
                  '@index':1,
                  '@name': '@value',
                  '@uom': 'unitless',
                  '@value':12
                }
              ]
            },
            {
              '@def_id': 'e262b5f8a121e712',
              '@group': 'synoptic_transmit_hours',
              '@id': '4b7257c65330773d',
              '@index':14,
              '@name': 'hour',
              '@uom': 'unitless',
              '@value': 'false',
              'element':[
                {
                  '@def_id': '49d7ca81db29ae17',
                  '@group': 'information',
                  '@id': '128d6e6cf375da82',
                  '@index':1,
                  '@name': 'data_source',
                  '@uom': 'unitless',
                  '@value': 'JICC'
                },
                {
                  '@def_id': '4163f9bbd04b8e90',
                  '@group': 'information',
                  '@id': 'f730a33b99cb4cac',
                  '@index':1,
                  '@name': 'writable',
                  '@uom': 'unitless',
                  '@value': 'true'
                },
                {
                  '@def_id': 'acebc3b9023386d',
                  '@group': 'synoptic_transmit_hours',
                  '@id': 'dd2bf7b4f92e497f',
                  '@index':1,
                  '@name': '@value',
                  '@uom': 'unitless',
                  '@value':13
                }
              ]
            },
            {
              '@def_id': 'e262b5f8a121e712',
              '@group': 'synoptic_transmit_hours',
              '@id': 'd4318c19d5a0ae11',
              '@index':15,
              '@name': 'hour',
              '@uom': 'unitless',
              '@value': 'false',
              'element':[
                {
                  '@def_id': '49d7ca81db29ae17',
                  '@group': 'information',
                  '@id': '9ec345a59f41df3d',
                  '@index':1,
                  '@name': 'data_source',
                  '@uom': 'unitless',
                  '@value': 'JICC'
                },
                {
                  '@def_id': '4163f9bbd04b8e90',
                  '@group': 'information',
                  '@id': 'b2be9ea8c57e5aa9',
                  '@index':1,
                  '@name': 'writable',
                  '@uom': 'unitless',
                  '@value': 'true'
                },
                {
                  '@def_id': 'acebc3b9023386d',
                  '@group': 'synoptic_transmit_hours',
                  '@id': '3832082a08dccf43',
                  '@index':1,
                  '@name': '@value',
                  '@uom': 'unitless',
                  '@value':14
                }
              ]
            },
            {
              '@def_id': 'e262b5f8a121e712',
              '@group': 'synoptic_transmit_hours',
              '@id': '74bb563729805b1',
              '@index':16,
              '@name': 'hour',
              '@uom': 'unitless',
              '@value': 'false',
              'element':[
                {
                  '@def_id': '49d7ca81db29ae17',
                  '@group': 'information',
                  '@id': '718592566399a830',
                  '@index':1,
                  '@name': 'data_source',
                  '@uom': 'unitless',
                  '@value': 'JICC'
                },
                {
                  '@def_id': '4163f9bbd04b8e90',
                  '@group': 'information',
                  '@id': '5ceb55043b7bef63',
                  '@index':1,
                  '@name': 'writable',
                  '@uom': 'unitless',
                  '@value': 'true'
                },
                {
                  '@def_id': 'acebc3b9023386d',
                  '@group': 'synoptic_transmit_hours',
                  '@id': 'c60ba0eb10cd0653',
                  '@index':1,
                  '@name': '@value',
                  '@uom': 'unitless',
                  '@value':15
                }
              ]
            },
            {
              '@def_id': 'e262b5f8a121e712',
              '@group': 'synoptic_transmit_hours',
              '@id': '96371770490d8612',
              '@index':17,
              '@name': 'hour',
              '@uom': 'unitless',
              '@value': 'false',
              'element':[
                {
                  '@def_id': '49d7ca81db29ae17',
                  '@group': 'information',
                  '@id': 'f2309a2349940c94',
                  '@index':1,
                  '@name': 'data_source',
                  '@uom': 'unitless',
                  '@value': 'JICC'
                },
                {
                  '@def_id': '4163f9bbd04b8e90',
                  '@group': 'information',
                  '@id': 'e2794d7e2b407cf6',
                  '@index':1,
                  '@name': 'writable',
                  '@uom': 'unitless',
                  '@value': 'true'
                },
                {
                  '@def_id': 'acebc3b9023386d',
                  '@group': 'synoptic_transmit_hours',
                  '@id': '788dd3a7ed227907',
                  '@index':1,
                  '@name': '@value',
                  '@uom': 'unitless',
                  '@value':16
                }
              ]
            },
            {
              '@def_id': 'e262b5f8a121e712',
              '@group': 'synoptic_transmit_hours',
              '@id': '22c483630ded6d4b',
              '@index':18,
              '@name': 'hour',
              '@uom': 'unitless',
              '@value': 'false',
              'element':[
                {
                  '@def_id': '49d7ca81db29ae17',
                  '@group': 'information',
                  '@id': 'e1dabd5665a5fcdd',
                  '@index':1,
                  '@name': 'data_source',
                  '@uom': 'unitless',
                  '@value': 'JICC'
                },
                {
                  '@def_id': '4163f9bbd04b8e90',
                  '@group': 'information',
                  '@id': '24a3839da938042a',
                  '@index':1,
                  '@name': 'writable',
                  '@uom': 'unitless',
                  '@value': 'true'
                },
                {
                  '@def_id': 'acebc3b9023386d',
                  '@group': 'synoptic_transmit_hours',
                  '@id': 'd22b80e6184dbf8e',
                  '@index':1,
                  '@name': '@value',
                  '@uom': 'unitless',
                  '@value':17
                }
              ]
            },
            {
              '@def_id': 'e262b5f8a121e712',
              '@group': 'synoptic_transmit_hours',
              '@id': 'a21531c2baffe2a',
              '@index':19,
              '@name': 'hour',
              '@uom': 'unitless',
              '@value': 'true',
              'element':[
                {
                  '@def_id': '49d7ca81db29ae17',
                  '@group': 'information',
                  '@id': 'c4b021eaa2f79e1f',
                  '@index':1,
                  '@name': 'data_source',
                  '@uom': 'unitless',
                  '@value': 'JICC'
                },
                {
                  '@def_id': '4163f9bbd04b8e90',
                  '@group': 'information',
                  '@id': 'a1001087aab758d2',
                  '@index':1,
                  '@name': 'writable',
                  '@uom': 'unitless',
                  '@value': 'true'
                },
                {
                  '@def_id': 'acebc3b9023386d',
                  '@group': 'synoptic_transmit_hours',
                  '@id': 'cc02658960395722',
                  '@index':1,
                  '@name': '@value',
                  '@uom': 'unitless',
                  '@value':18
                }
              ]
            },
            {
              '@def_id': 'e262b5f8a121e712',
              '@group': 'synoptic_transmit_hours',
              '@id': '3ed6d2840f1f49aa',
              '@index':20,
              '@name': 'hour',
              '@uom': 'unitless',
              '@value': 'false',
              'element':[
                {
                  '@def_id': '49d7ca81db29ae17',
                  '@group': 'information',
                  '@id': '33cf825282c7c19a',
                  '@index':1,
                  '@name': 'data_source',
                  '@uom': 'unitless',
                  '@value': 'JICC'
                },
                {
                  '@def_id': '4163f9bbd04b8e90',
                  '@group': 'information',
                  '@id': '756c8f3909d38408',
                  '@index':1,
                  '@name': 'writable',
                  '@uom': 'unitless',
                  '@value': 'true'
                },
                {
                  '@def_id': 'acebc3b9023386d',
                  '@group': 'synoptic_transmit_hours',
                  '@id': 'a4f4850696b436ef',
                  '@index':1,
                  '@name': '@value',
                  '@uom': 'unitless',
                  '@value':19
                }
              ]
            },
            {
              '@def_id': 'e262b5f8a121e712',
              '@group': 'synoptic_transmit_hours',
              '@id': 'e047ebc48812e054',
              '@index':21,
              '@name': 'hour',
              '@uom': 'unitless',
              '@value': 'false',
              'element':[
                {
                  '@def_id': '49d7ca81db29ae17',
                  '@group': 'information',
                  '@id': '119b8c36ee422bb3',
                  '@index':1,
                  '@name': 'data_source',
                  '@uom': 'unitless',
                  '@value': 'JICC'
                },
                {
                  '@def_id': '4163f9bbd04b8e90',
                  '@group': 'information',
                  '@id': '7fabddc5a7e782c4',
                  '@index':1,
                  '@name': 'writable',
                  '@uom': 'unitless',
                  '@value': 'true'
                },
                {
                  '@def_id': 'acebc3b9023386d',
                  '@group': 'synoptic_transmit_hours',
                  '@id': '318b5531e108da1e',
                  '@index':1,
                  '@name': '@value',
                  '@uom': 'unitless',
                  '@value':20
                }
              ]
            },
            {
              '@def_id': 'e262b5f8a121e712',
              '@group': 'synoptic_transmit_hours',
              '@id': 'a3dd5734207e29da',
              '@index':22,
              '@name': 'hour',
              '@uom': 'unitless',
              '@value': 'false',
              'element':[
                {
                  '@def_id': '49d7ca81db29ae17',
                  '@group': 'information',
                  '@id': '9b38b3234fc15268',
                  '@index':1,
                  '@name': 'data_source',
                  '@uom': 'unitless',
                  '@value': 'JICC'
                },
                {
                  '@def_id': '4163f9bbd04b8e90',
                  '@group': 'information',
                  '@id': '3e2ace86412368c1',
                  '@index':1,
                  '@name': 'writable',
                  '@uom': 'unitless',
                  '@value': 'true'
                },
                {
                  '@def_id': 'acebc3b9023386d',
                  '@group': 'synoptic_transmit_hours',
                  '@id': '9e17f15018f43778',
                  '@index':1,
                  '@name': '@value',
                  '@uom': 'unitless',
                  '@value':21
                }
              ]
            },
            {
              '@def_id': 'e262b5f8a121e712',
              '@group': 'synoptic_transmit_hours',
              '@id': 'ed52dc3c10b333b9',
              '@index':23,
              '@name': 'hour',
              '@uom': 'unitless',
              '@value': 'false',
              'element':[
                {
                  '@def_id': '49d7ca81db29ae17',
                  '@group': 'information',
                  '@id': 'a639938e8ca39010',
                  '@index':1,
                  '@name': 'data_source',
                  '@uom': 'unitless',
                  '@value': 'JICC'
                },
                {
                  '@def_id': '4163f9bbd04b8e90',
                  '@group': 'information',
                  '@id': 'ed8b897f115378f8',
                  '@index':1,
                  '@name': 'writable',
                  '@uom': 'unitless',
                  '@value': 'true'
                },
                {
                  '@def_id': 'acebc3b9023386d',
                  '@group': 'synoptic_transmit_hours',
                  '@id': '69f84973906f9190',
                  '@index':1,
                  '@name': '@value',
                  '@uom': 'unitless',
                  '@value':22
                }
              ]
            },
            {
              '@def_id': 'e262b5f8a121e712',
              '@group': 'synoptic_transmit_hours',
              '@id': '542f104845b434ca',
              '@index':24,
              '@name': 'hour',
              '@uom': 'unitless',
              '@value': 'false',
              'element':[
                {
                  '@def_id': '49d7ca81db29ae17',
                  '@group': 'information',
                  '@id': 'fe92afe134d84a2d',
                  '@index':1,
                  '@name': 'data_source',
                  '@uom': 'unitless',
                  '@value': 'JICC'
                },
                {
                  '@def_id': '4163f9bbd04b8e90',
                  '@group': 'information',
                  '@id': 'c1cf8ba6772d82fb',
                  '@index':1,
                  '@name': 'writable',
                  '@uom': 'unitless',
                  '@value': 'true'
                },
                {
                  '@def_id': 'acebc3b9023386d',
                  '@group': 'synoptic_transmit_hours',
                  '@id': 'a580d7270776ea76',
                  '@index':1,
                  '@name': '@value',
                  '@uom': 'unitless',
                  '@value':23
                }
              ]
            },
            {
              '@def_id': '8dcad2603210641d',
              '@group': 'temperature_limits',
              '@id': '2c91b09dfd202e04',
              '@index':1,
              '@name': 'month',
              '@uom': 'unitless',
              '@value':1,
              'element':[
                {
                  '@def_id': 'cdde48906b7966f2',
                  '@group': 'information',
                  '@id': 'fba5a8f9c8c7b6b6',
                  '@index':1,
                  '@name': 'data_source',
                  '@uom': 'unitless',
                  '@value': 'JICC'
                },
                {
                  '@def_id': 'a720ccd8777f25b',
                  '@group': 'information',
                  '@id': 'e73415c19d6416e9',
                  '@index':1,
                  '@name': 'writable',
                  '@uom': 'unitless',
                  '@value': 'true'
                },
                {
                  '@def_id': 'bf64785025b9efc',
                  '@group': 'temperature_limits',
                  '@id': '9d151267a13a0fb',
                  '@index':1,
                  '@name': 'max',
                  '@uom': '\u00B0C',
                  '@value':50.0
                },
                {
                  '@def_id': '1459b4fb5dc4de63',
                  '@group': 'temperature_limits',
                  '@id': 'cd9d5900381bcd33',
                  '@index':1,
                  '@name': 'min',
                  '@uom': '\u00B0C',
                  '@value':-45.0
                }
              ]
            },
            {
              '@def_id': '8dcad2603210641d',
              '@group': 'temperature_limits',
              '@id': '48fedd334f384abc',
              '@index':2,
              '@name': 'month',
              '@uom': 'unitless',
              '@value':2,
              'element':[
                {
                  '@def_id': 'cdde48906b7966f2',
                  '@group': 'information',
                  '@id': 'a26a46f605dba5de',
                  '@index':1,
                  '@name': 'data_source',
                  '@uom': 'unitless',
                  '@value': 'JICC'
                },
                {
                  '@def_id': 'a720ccd8777f25b',
                  '@group': 'information',
                  '@id': '1366fb759ca5c57a',
                  '@index':1,
                  '@name': 'writable',
                  '@uom': 'unitless',
                  '@value': 'true'
                },
                {
                  '@def_id': 'bf64785025b9efc',
                  '@group': 'temperature_limits',
                  '@id': '14949e388a9d73da',
                  '@index':1,
                  '@name': 'max',
                  '@uom': '\u00B0C',
                  '@value':50.0
                },
                {
                  '@def_id': '1459b4fb5dc4de63',
                  '@group': 'temperature_limits',
                  '@id': '55992b9fe29e2a8',
                  '@index':1,
                  '@name': 'min',
                  '@uom': '\u00B0C',
                  '@value':-45.0
                }
              ]
            },
            {
              '@def_id': '8dcad2603210641d',
              '@group': 'temperature_limits',
              '@id': '950e223d0f5a5cf7',
              '@index':3,
              '@name': 'month',
              '@uom': 'unitless',
              '@value':3,
              'element':[
                {
                  '@def_id': 'cdde48906b7966f2',
                  '@group': 'information',
                  '@id': 'adc25235ddd0d7dc',
                  '@index':1,
                  '@name': 'data_source',
                  '@uom': 'unitless',
                  '@value': 'JICC'
                },
                {
                  '@def_id': 'a720ccd8777f25b',
                  '@group': 'information',
                  '@id': '38e1a44fc4b220d5',
                  '@index':1,
                  '@name': 'writable',
                  '@uom': 'unitless',
                  '@value': 'true'
                },
                {
                  '@def_id': 'bf64785025b9efc',
                  '@group': 'temperature_limits',
                  '@id': '5288c4d69410bfa9',
                  '@index':1,
                  '@name': 'max',
                  '@uom': '\u00B0C',
                  '@value':50.0
                },
                {
                  '@def_id': '1459b4fb5dc4de63',
                  '@group': 'temperature_limits',
                  '@id': '28a47ac6cb3d6e2b',
                  '@index':1,
                  '@name': 'min',
                  '@uom': '\u00B0C',
                  '@value':-45.0
                }
              ]
            },
            {
              '@def_id': '8dcad2603210641d',
              '@group': 'temperature_limits',
              '@id': '47d84c6526eabe6b',
              '@index':4,
              '@name': 'month',
              '@uom': 'unitless',
              '@value':4,
              'element':[
                {
                  '@def_id': 'cdde48906b7966f2',
                  '@group': 'information',
                  '@id': '1eeb8ddaaddf075',
                  '@index':1,
                  '@name': 'data_source',
                  '@uom': 'unitless',
                  '@value': 'JICC'
                },
                {
                  '@def_id': 'a720ccd8777f25b',
                  '@group': 'information',
                  '@id': 'cb31b89f0addbc98',
                  '@index':1,
                  '@name': 'writable',
                  '@uom': 'unitless',
                  '@value': 'true'
                },
                {
                  '@def_id': 'bf64785025b9efc',
                  '@group': 'temperature_limits',
                  '@id': '8abe211d5b812e32',
                  '@index':1,
                  '@name': 'max',
                  '@uom': '\u00B0C',
                  '@value':50.0
                },
                {
                  '@def_id': '1459b4fb5dc4de63',
                  '@group': 'temperature_limits',
                  '@id': 'db5c7a3a8b28f405',
                  '@index':1,
                  '@name': 'min',
                  '@uom': '\u00B0C',
                  '@value':-45.0
                }
              ]
            },
            {
              '@def_id': '8dcad2603210641d',
              '@group': 'temperature_limits',
              '@id': 'db0b5154e1e28747',
              '@index':5,
              '@name': 'month',
              '@uom': 'unitless',
              '@value':5,
              'element':[
                {
                  '@def_id': 'cdde48906b7966f2',
                  '@group': 'information',
                  '@id': 'b9c7e2d07fb960f2',
                  '@index':1,
                  '@name': 'data_source',
                  '@uom': 'unitless',
                  '@value': 'JICC'
                },
                {
                  '@def_id': 'a720ccd8777f25b',
                  '@group': 'information',
                  '@id': 'c9fd2188674b3b9',
                  '@index':1,
                  '@name': 'writable',
                  '@uom': 'unitless',
                  '@value': 'true'
                },
                {
                  '@def_id': 'bf64785025b9efc',
                  '@group': 'temperature_limits',
                  '@id': '4f756f3f4417da11',
                  '@index':1,
                  '@name': 'max',
                  '@uom': '\u00B0C',
                  '@value':50.0
                },
                {
                  '@def_id': '1459b4fb5dc4de63',
                  '@group': 'temperature_limits',
                  '@id': '1e47fd5b30df96b9',
                  '@index':1,
                  '@name': 'min',
                  '@uom': '\u00B0C',
                  '@value':-45.0
                }
              ]
            },
            {
              '@def_id': '8dcad2603210641d',
              '@group': 'temperature_limits',
              '@id': '84fe04f0d1a0ce85',
              '@index':6,
              '@name': 'month',
              '@uom': 'unitless',
              '@value':6,
              'element':[
                {
                  '@def_id': 'cdde48906b7966f2',
                  '@group': 'information',
                  '@id': '2ac8d364839640aa',
                  '@index':1,
                  '@name': 'data_source',
                  '@uom': 'unitless',
                  '@value': 'JICC'
                },
                {
                  '@def_id': 'a720ccd8777f25b',
                  '@group': 'information',
                  '@id': '8e9cd9a74810a566',
                  '@index':1,
                  '@name': 'writable',
                  '@uom': 'unitless',
                  '@value': 'true'
                },
                {
                  '@def_id': 'bf64785025b9efc',
                  '@group': 'temperature_limits',
                  '@id': '4b818bc985d4d6df',
                  '@index':1,
                  '@name': 'max',
                  '@uom': '\u00B0C',
                  '@value':50.0
                },
                {
                  '@def_id': '1459b4fb5dc4de63',
                  '@group': 'temperature_limits',
                  '@id': 'e250b2e32b8717ba',
                  '@index':1,
                  '@name': 'min',
                  '@uom': '\u00B0C',
                  '@value':-45.0
                }
              ]
            },
            {
              '@def_id': '8dcad2603210641d',
              '@group': 'temperature_limits',
              '@id': '326e170c66b5d8ad',
              '@index':7,
              '@name': 'month',
              '@uom': 'unitless',
              '@value':7,
              'element':[
                {
                  '@def_id': 'cdde48906b7966f2',
                  '@group': 'information',
                  '@id': '9d87036687e0ac1e',
                  '@index':1,
                  '@name': 'data_source',
                  '@uom': 'unitless',
                  '@value': 'JICC'
                },
                {
                  '@def_id': 'a720ccd8777f25b',
                  '@group': 'information',
                  '@id': '9370b4f10cf05fe4',
                  '@index':1,
                  '@name': 'writable',
                  '@uom': 'unitless',
                  '@value': 'true'
                },
                {
                  '@def_id': 'bf64785025b9efc',
                  '@group': 'temperature_limits',
                  '@id': '7c6b6bebcc8db542',
                  '@index':1,
                  '@name': 'max',
                  '@uom': '\u00B0C',
                  '@value':50.0
                },
                {
                  '@def_id': '1459b4fb5dc4de63',
                  '@group': 'temperature_limits',
                  '@id': '102bb72524186708',
                  '@index':1,
                  '@name': 'min',
                  '@uom': '\u00B0C',
                  '@value':-45.0
                }
              ]
            },
            {
              '@def_id': '8dcad2603210641d',
              '@group': 'temperature_limits',
              '@id': 'd23ff947dc84945e',
              '@index':8,
              '@name': 'month',
              '@uom': 'unitless',
              '@value':8,
              'element':[
                {
                  '@def_id': 'cdde48906b7966f2',
                  '@group': 'information',
                  '@id': '40b837c84a2ef52d',
                  '@index':1,
                  '@name': 'data_source',
                  '@uom': 'unitless',
                  '@value': 'JICC'
                },
                {
                  '@def_id': 'a720ccd8777f25b',
                  '@group': 'information',
                  '@id': 'ca9b63253054a47f',
                  '@index':1,
                  '@name': 'writable',
                  '@uom': 'unitless',
                  '@value': 'true'
                },
                {
                  '@def_id': 'bf64785025b9efc',
                  '@group': 'temperature_limits',
                  '@id': 'eccb24c0ee4d3b38',
                  '@index':1,
                  '@name': 'max',
                  '@uom': '\u00B0C',
                  '@value':50.0
                },
                {
                  '@def_id': '1459b4fb5dc4de63',
                  '@group': 'temperature_limits',
                  '@id': '53b3bee1cae378dd',
                  '@index':1,
                  '@name': 'min',
                  '@uom': '\u00B0C',
                  '@value':-45.0
                }
              ]
            },
            {
              '@def_id': '8dcad2603210641d',
              '@group': 'temperature_limits',
              '@id': 'a6215167c2c67d4f',
              '@index':9,
              '@name': 'month',
              '@uom': 'unitless',
              '@value':9,
              'element':[
                {
                  '@def_id': 'cdde48906b7966f2',
                  '@group': 'information',
                  '@id': 'f183799343396ca3',
                  '@index':1,
                  '@name': 'data_source',
                  '@uom': 'unitless',
                  '@value': 'JICC'
                },
                {
                  '@def_id': 'a720ccd8777f25b',
                  '@group': 'information',
                  '@id': 'ea8a3823dd6a9b69',
                  '@index':1,
                  '@name': 'writable',
                  '@uom': 'unitless',
                  '@value': 'true'
                },
                {
                  '@def_id': 'bf64785025b9efc',
                  '@group': 'temperature_limits',
                  '@id': '42b398a394603755',
                  '@index':1,
                  '@name': 'max',
                  '@uom': '\u00B0C',
                  '@value':50.0
                },
                {
                  '@def_id': '1459b4fb5dc4de63',
                  '@group': 'temperature_limits',
                  '@id': '766c5687eede4164',
                  '@index':1,
                  '@name': 'min',
                  '@uom': '\u00B0C',
                  '@value':-45.0
                }
              ]
            },
            {
              '@def_id': '8dcad2603210641d',
              '@group': 'temperature_limits',
              '@id': '64d12fbc7c38530f',
              '@index':10,
              '@name': 'month',
              '@uom': 'unitless',
              '@value':10,
              'element':[
                {
                  '@def_id': 'cdde48906b7966f2',
                  '@group': 'information',
                  '@id': 'f1ac02e43b409360',
                  '@index':1,
                  '@name': 'data_source',
                  '@uom': 'unitless',
                  '@value': 'JICC'
                },
                {
                  '@def_id': 'a720ccd8777f25b',
                  '@group': 'information',
                  '@id': '6c3eb3f27ae5f5e5',
                  '@index':1,
                  '@name': 'writable',
                  '@uom': 'unitless',
                  '@value': 'true'
                },
                {
                  '@def_id': 'bf64785025b9efc',
                  '@group': 'temperature_limits',
                  '@id': '26f7c2e7d88fc7c0',
                  '@index':1,
                  '@name': 'max',
                  '@uom': '\u00B0C',
                  '@value':50.0
                },
                {
                  '@def_id': '1459b4fb5dc4de63',
                  '@group': 'temperature_limits',
                  '@id': 'a52a7e4ee652ad5a',
                  '@index':1,
                  '@name': 'min',
                  '@uom': '\u00B0C',
                  '@value':-45.0
                }
              ]
            },
            {
              '@def_id': '8dcad2603210641d',
              '@group': 'temperature_limits',
              '@id': 'd60b71c2607c13e6',
              '@index':11,
              '@name': 'month',
              '@uom': 'unitless',
              '@value':11,
              'element':[
                {
                  '@def_id': 'cdde48906b7966f2',
                  '@group': 'information',
                  '@id': '971d5cdde0afcac0',
                  '@index':1,
                  '@name': 'data_source',
                  '@uom': 'unitless',
                  '@value': 'JICC'
                },
                {
                  '@def_id': 'a720ccd8777f25b',
                  '@group': 'information',
                  '@id': '37eb0ff33585f67d',
                  '@index':1,
                  '@name': 'writable',
                  '@uom': 'unitless',
                  '@value': 'true'
                },
                {
                  '@def_id': 'bf64785025b9efc',
                  '@group': 'temperature_limits',
                  '@id': '739c2f89730ce545',
                  '@index':1,
                  '@name': 'max',
                  '@uom': '\u00B0C',
                  '@value':50.0
                },
                {
                  '@def_id': '1459b4fb5dc4de63',
                  '@group': 'temperature_limits',
                  '@id': '8cc1b7fbe29f4473',
                  '@index':1,
                  '@name': 'min',
                  '@uom': '\u00B0C',
                  '@value':-45.0
                }
              ]
            },
            {
              '@def_id': '8dcad2603210641d',
              '@group': 'temperature_limits',
              '@id': '9324a094e374fd49',
              '@index':12,
              '@name': 'month',
              '@uom': 'unitless',
              '@value':12,
              'element':[
                {
                  '@def_id': 'cdde48906b7966f2',
                  '@group': 'information',
                  '@id': 'b1d7c774b1e1581d',
                  '@index':1,
                  '@name': 'data_source',
                  '@uom': 'unitless',
                  '@value': 'JICC'
                },
                {
                  '@def_id': 'a720ccd8777f25b',
                  '@group': 'information',
                  '@id': 'c2ba884be44a7875',
                  '@index':1,
                  '@name': 'writable',
                  '@uom': 'unitless',
                  '@value': 'true'
                },
                {
                  '@def_id': 'bf64785025b9efc',
                  '@group': 'temperature_limits',
                  '@id': '5c1593cf5587c89a',
                  '@index':1,
                  '@name': 'max',
                  '@uom': '\u00B0C',
                  '@value':50.0
                },
                {
                  '@def_id': '1459b4fb5dc4de63',
                  '@group': 'temperature_limits',
                  '@id': '2d3cccbc685aad05',
                  '@index':1,
                  '@name': 'min',
                  '@uom': '\u00B0C',
                  '@value':-45.0
                }
              ]
            },
            {
              '@def_id': 'f5245512c516a71f',
              '@group': 'time_zone',
              '@id': '3ad8d55064ac3ca1',
              '@index':1,
              '@name': 'message_timezone',
              '@uom': 'unitless',
              '@value': 'GMT',
              'element':[
                {
                  '@def_id': '27dd799caa60602',
                  '@group': 'information',
                  '@id': '696c56315d81dd6e',
                  '@index':1,
                  '@name': 'data_source',
                  '@uom': 'unitless',
                  '@value': 'JICC'
                },
                {
                  '@def_id': '1a4ce1136500e8ca',
                  '@group': 'information',
                  '@id': '85ee2b0a7fd5dc71',
                  '@index':1,
                  '@name': 'writable',
                  '@uom': 'unitless',
                  '@value': 'true'
                }
              ],
              'language':{
                '@name': 'en',
                '@value': 'UTC'
              }
            },
            {
              '@def_id': '985c075283baf8ba',
              '@group': 'transmission',
              '@id': '15c0d1061947121e',
              '@index':1,
              '@name': 'secondary_data_transmission_method',
              '@uom': 'unitless',
              '@value': 'No secondary method needed',
              'element':[
                {
                  '@def_id': '51a618a1d7d4719c',
                  '@group': 'information',
                  '@id': 'fdee427b1a6c8a27',
                  '@index':1,
                  '@name': 'data_source',
                  '@uom': 'unitless',
                  '@value': 'SAP'
                },
                {
                  '@def_id': '543a5e33271a6a99',
                  '@group': 'information',
                  '@id': 'eed618fba2ac6a2e',
                  '@index':1,
                  '@name': 'writable',
                  '@uom': 'unitless',
                  '@value': 'false'
                }
              ]
            }
          ]
        }
      }
    }
  }
};

}
