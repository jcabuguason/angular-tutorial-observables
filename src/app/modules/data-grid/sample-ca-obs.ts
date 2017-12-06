export default class CAData {


      /*
  static testHeader = {
    "aggregations":{
      "dataElements":{
      "doc_count":1849878,
      "index":{
      "doc_count_error_upper_bound":0,
      "sum_other_doc_count":0,
      "buckets":[{
      "key":"1.2.10.0.0.0.0","doc_count":170227,"maxIndex":{ "value":62.0},"minIndex":{ "value":1.0}},{
      "key":"1.19.265.2.1.1.0","doc_count":45993,"maxIndex":{ "value":3.0},"minIndex":{ "value":0.0}},{
      "key":"1.19.265.7.60.7.0","doc_count":45527,"maxIndex":{ "value":3.0},"minIndex":{ "value":0.0}},{
      "key":"1.19.265.8.60.7.0","doc_count":45527,"maxIndex":{ "value":3.0},"minIndex":{ "value":0.0}},{
      "key":"1.19.265.2.60.7.0","doc_count":45299,"maxIndex":{ "value":3.0},"minIndex":{ "value":0.0}},{
      "key":"1.11.172.2.5.3.0","doc_count":38923,"maxIndex":{ "value":3.0},"minIndex":{ "value":0.0}},{
      "key":"1.11.172.2.20.3.0","doc_count":38672,"maxIndex":{ "value":3.0},"minIndex":{ "value":0.0}},{
      "key":"1.11.172.2.35.3.0","doc_count":38672,"maxIndex":{ "value":3.0},"minIndex":{ "value":0.0}},{
      "key":"1.11.172.2.50.3.0","doc_count":38672,"maxIndex":{ "value":3.0},"minIndex":{ "value":0.0}},{
      "key":"1.11.174.2.5.3.0","doc_count":32092,"maxIndex":{ "value":3.0},"minIndex":{ "value":0.0}},{
      "key":"1.11.173.2.35.3.0","doc_count":31728,"maxIndex":{ "value":4.0},"minIndex":{ "value":0.0}},{
      "key":"1.11.173.2.20.3.0","doc_count":31704,"maxIndex":{ "value":3.0},"minIndex":{ "value":0.0}},{
      "key":"1.11.173.2.5.3.0","doc_count":31704,"maxIndex":{ "value":3.0},"minIndex":{ "value":0.0}},{
      "key":"1.11.173.2.50.3.0","doc_count":31704,"maxIndex":{ "value":3.0},"minIndex":{ "value":0.0}},{
      "key":"1.11.174.2.20.3.0","doc_count":27713,"maxIndex":{ "value":3.0},"minIndex":{ "value":0.0}},{
      "key":"1.11.174.2.35.3.0","doc_count":27713,"maxIndex":{ "value":3.0},"minIndex":{ "value":0.0}},{
      "key":"1.11.174.2.50.3.0","doc_count":27713,"maxIndex":{ "value":3.0},"minIndex":{ "value":0.0}},{
      "key":"1.24.320.9.60.7.6","doc_count":21637,"maxIndex":{ "value":2.0},"minIndex":{ "value":0.0}},{
      "key":"1.24.314.2.10.4.6","doc_count":17631,"maxIndex":{ "value":2.0},"minIndex":{ "value":0.0}},{
      "key":"1.24.320.12.10.4.6","doc_count":17608,"maxIndex":{ "value":2.0},"minIndex":{ "value":0.0}},{
      "key":"1.24.314.7.60.7.6","doc_count":17300,"maxIndex":{ "value":2.0},"minIndex":{ "value":0.0}},{
      "key":"1.24.320.12.2.2.6","doc_count":17283,"maxIndex":{ "value":2.0},"minIndex":{ "value":0.0}},{
      "key":"1.24.314.2.2.2.6","doc_count":17214,"maxIndex":{ "value":2.0},"minIndex":{ "value":0.0}},{
      "key":"1.24.314.2.60.7.6","doc_count":17096,"maxIndex":{ "value":2.0},"minIndex":{ "value":0.0}},{
      "key":"1.24.316.0.60.7.0","doc_count":17096,"maxIndex":{ "value":2.0},"minIndex":{ "value":0.0}},{
      "key":"1.24.323.0.60.7.6","doc_count":17093,"maxIndex":{ "value":2.0},"minIndex":{ "value":0.0}},{
      "key":"1.24.320.12.60.7.6","doc_count":17073,"maxIndex":{ "value":2.0},"minIndex":{ "value":0.0}},{
      "key":"1.24.318.7.60.7.6","doc_count":16893,"maxIndex":{ "value":2.0},"minIndex":{ "value":0.0}},{
      "key":"1.12.207.2.1.1.0","doc_count":16577,"maxIndex":{ "value":null},"minIndex":{ "value":null}},{
      "key":"1.4.65.0.0.0.0","doc_count":16577,"maxIndex":{ "value":null},"minIndex":{ "value":null}},{
      "key":"1.12.210.2.1.1.0","doc_count":16554,"maxIndex":{ "value":null},"minIndex":{ "value":null}},{
      "key":"1.19.265.0.66.0.0","doc_count":16554,"maxIndex":{ "value":null},"minIndex":{ "value":null}},{
      "key":"1.19.265.2.67.14.0","doc_count":16554,"maxIndex":{ "value":null},"minIndex":{ "value":null}},{
      "key":"1.19.267.2.1.1.0","doc_count":16554,"maxIndex":{ "value":null},"minIndex":{ "value":null}},{
      "key":"1.19.271.2.1.1.0","doc_count":16551,"maxIndex":{ "value":null},"minIndex":{ "value":null}},{
      "key":"1.5.66.2.1.1.0","doc_count":16435,"maxIndex":{ "value":2.0},"minIndex":{ "value":0.0}},{
      "key":"1.11.171.1.60.7.0","doc_count":16273,"maxIndex":{ "value":2.0},"minIndex":{ "value":0.0}},{
      "key":"1.19.265.15.67.14.0","doc_count":16134,"maxIndex":{ "value":null},"minIndex":{ "value":null}},{
      "key":"1.19.265.7.65.12.0","doc_count":16134,"maxIndex":{ "value":null},"minIndex":{ "value":null}},{
      "key":"1.19.265.7.67.14.0","doc_count":16134,"maxIndex":{ "value":null},"minIndex":{ "value":null}},{
      "key":"1.19.265.8.65.12.0","doc_count":16134,"maxIndex":{ "value":null},"minIndex":{ "value":null}},{
      "key":"1.19.265.8.67.14.0","doc_count":16134,"maxIndex":{ "value":null},"minIndex":{ "value":null}},{
      "key":"1.4.273.0.0.0.0","doc_count":16134,"maxIndex":{ "value":null},"minIndex":{ "value":null}},{
      "key":"1.4.274.0.0.0.0","doc_count":16134,"maxIndex":{ "value":null},"minIndex":{ "value":null}},{
      "key":"1.2.11.0.0.0.0","doc_count":15952,"maxIndex":{ "value":null},"minIndex":{ "value":null}},{
      "key":"1.11.171.1.67.14.0","doc_count":15633,"maxIndex":{ "value":null},"minIndex":{ "value":null}},{
      "key":"1.11.171.1.66.13.0","doc_count":15608,"maxIndex":{ "value":null},"minIndex":{ "value":null}},{
      "key":"1.11.171.1.65.12.0","doc_count":15591,"maxIndex":{ "value":null},"minIndex":{ "value":null}},{
      "key":"1.11.171.1.62.9.0","doc_count":15582,"maxIndex":{ "value":null},"minIndex":{ "value":null}},{
      "key":"1.11.178.0.0.0.0","doc_count":15581,"maxIndex":{ "value":null},"minIndex":{ "value":null}},{
      "key":"1.12.206.15.67.14.0","doc_count":15545,"maxIndex":{ "value":null},"minIndex":{ "value":null}},{
      "key":"1.12.206.2.1.1.0","doc_count":15545,"maxIndex":{ "value":null},"minIndex":{ "value":null}},{
      "key":"1.12.206.7.67.14.0","doc_count":15545,"maxIndex":{ "value":null},"minIndex":{ "value":null}},{
      "key":"1.12.206.8.67.14.0","doc_count":15545,"maxIndex":{ "value":null},"minIndex":{ "value":null}},{
      "key":"1.12.208.3.60.7.0","doc_count":15545,"maxIndex":{ "value":null},"minIndex":{ "value":null}},{
      "key":"1.12.208.3.62.9.0","doc_count":15545,"maxIndex":{ "value":null},"minIndex":{ "value":null}},{
      "key":"1.12.209.10.62.9.0","doc_count":15545,"maxIndex":{ "value":null},"minIndex":{ "value":null}},{
      "key":"1.24.314.7.10.4.6","doc_count":13345,"maxIndex":{ "value":2.0},"minIndex":{ "value":0.0}},{
      "key":"1.24.323.0.10.4.6","doc_count":12118,"maxIndex":{ "value":2.0},"minIndex":{ "value":0.0}},{
      "key":"1.24.321.0.60.7.6","doc_count":12094,"maxIndex":{ "value":2.0},"minIndex":{ "value":0.0}},{
      "key":"1.2.8.8.60.7.0","doc_count":11130,"maxIndex":{ "value":null},"minIndex":{ "value":null}},{
      "key":"1.11.169.1.60.7.0","doc_count":11113,"maxIndex":{ "value":null},"minIndex":{ "value":null}},{
      "key":"1.19.264.0.0.0.0","doc_count":11108,"maxIndex":{ "value":null},"minIndex":{ "value":null}},{
      "key":"1.5.66.15.67.14.0","doc_count":10946,"maxIndex":{ "value":null},"minIndex":{ "value":null}},{
      "key":"1.5.66.7.60.7.0","doc_count":10946,"maxIndex":{ "value":null},"minIndex":{ "value":null}},{
      "key":"1.5.66.7.67.14.0","doc_count":10946,"maxIndex":{ "value":null},"minIndex":{ "value":null}},{
      "key":"1.5.66.8.60.7.0","doc_count":10946,"maxIndex":{ "value":null},"minIndex":{ "value":null}},{
      "key":"1.5.66.8.67.14.0","doc_count":10946,"maxIndex":{ "value":null},"minIndex":{ "value":null}},{
      "key":"1.2.8.7.60.7.0","doc_count":10789,"maxIndex":{ "value":null},"minIndex":{ "value":null}},{
      "key":"1.24.319.2.15.5.0","doc_count":10483,"maxIndex":{ "value":null},"minIndex":{ "value":null}},{
      "key":"1.24.319.2.30.5.0","doc_count":10483,"maxIndex":{ "value":null},"minIndex":{ "value":null}},{
      "key":"1.24.319.2.45.5.0","doc_count":10483,"maxIndex":{ "value":null},"minIndex":{ "value":null}},{
      "key":"1.24.319.2.60.5.0","doc_count":10483,"maxIndex":{ "value":null},"minIndex":{ "value":null}},{
      "key":"1.14.221.2.60.7.0","doc_count":10249,"maxIndex":{ "value":null},"minIndex":{ "value":null}},{
      "key":"1.11.171.1.30.5.0","doc_count":10135,"maxIndex":{ "value":null},"minIndex":{ "value":null}},{
      "key":"1.11.171.1.45.5.0","doc_count":10135,"maxIndex":{ "value":null},"minIndex":{ "value":null}},{
      "key":"1.11.171.1.15.5.0","doc_count":10112,"maxIndex":{ "value":null},"minIndex":{ "value":null}},{
      "key":"1.11.171.1.60.5.0","doc_count":10088,"maxIndex":{ "value":null},"minIndex":{ "value":null}},{
      "key":"1.24.324.2.10.4.0","doc_count":8646,"maxIndex":{ "value":null},"minIndex":{ "value":null}},{
      "key":"1.24.319.2.10.4.0","doc_count":8555,"maxIndex":{ "value":null},"minIndex":{ "value":null}},{
      "key":"1.2.15.0.0.0.0","doc_count":8195,"maxIndex":{ "value":null},"minIndex":{ "value":null}},{
      "key":"1.2.14.0.0.0.0","doc_count":8194,"maxIndex":{ "value":null},"minIndex":{ "value":null}},{
      "key":"1.2.12.0.0.0.0","doc_count":8172,"maxIndex":{ "value":null},"minIndex":{ "value":null}},{
      "key":"1.2.13.0.0.0.0","doc_count":8172,"maxIndex":{ "value":null},"minIndex":{ "value":null}},{
      "key":"1.2.16.0.0.0.0","doc_count":8149,"maxIndex":{ "value":null},"minIndex":{ "value":null}},{
      "key":"1.2.8.2.60.7.0","doc_count":8120,"maxIndex":{ "value":2.0},"minIndex":{ "value":1.0}},{
      "key":"1.24.314.11.10.4.6","doc_count":5871,"maxIndex":{ "value":2.0},"minIndex":{ "value":0.0}},{
      "key":"1.24.320.9.2.2.6","doc_count":5054,"maxIndex":{ "value":2.0},"minIndex":{ "value":0.0}},{
      "key":"1.4.55.0.0.0.0","doc_count":4978,"maxIndex":{ "value":null},"minIndex":{ "value":null}},{
      "key":"1.24.320.9.10.4.6","doc_count":4937,"maxIndex":{ "value":null},"minIndex":{ "value":null}},{
      "key":"1.24.314.11.60.7.6","doc_count":4914,"maxIndex":{ "value":null},"minIndex":{ "value":null}},{
      "key":"1.24.317.7.60.7.6","doc_count":4914,"maxIndex":{ "value":null},"minIndex":{ "value":null}},{
      "key":"1.5.66.2.60.7.0","doc_count":4914,"maxIndex":{ "value":null},"minIndex":{ "value":null}},{
      "key":"1.4.57.0.0.0.0","doc_count":4787,"maxIndex":{ "value":null},"minIndex":{ "value":null}},{
      "key":"1.24.336.0.60.7.6","doc_count":4765,"maxIndex":{ "value":null},"minIndex":{ "value":null}},{
      "key":"1.24.337.0.0.0.0","doc_count":4765,"maxIndex":{ "value":null},"minIndex":{ "value":null}},{
      "key":"1.24.334.0.0.0.0","doc_count":4734,"maxIndex":{ "value":null},"minIndex":{ "value":null}},{
      "key":"1.24.335.0.60.7.6","doc_count":4673,"maxIndex":{ "value":null},"minIndex":{ "value":null}},{
      "key":"1.24.314.11.2.2.6","doc_count":4470,"maxIndex":{ "value":null},"minIndex":{ "value":null}},{
      "key":"1.11.186.1.60.7.0","doc_count":4104,"maxIndex":{ "value":null},"minIndex":{ "value":null}},{
      "key":"1.18.224.1.60.7.0","doc_count":4035,"maxIndex":{ "value":null},"minIndex":{ "value":null}},{
      "key":"1.14.221.2.60.3.0","doc_count":4013,"maxIndex":{ "value":null},"minIndex":{ "value":null}},{
      "key":"1.14.221.2.10.3.0","doc_count":3989,"maxIndex":{ "value":null},"minIndex":{ "value":null}},{
      "key":"1.14.221.2.15.3.0","doc_count":3989,"maxIndex":{ "value":null},"minIndex":{ "value":null}},{
      "key":"1.14.221.2.20.3.0","doc_count":3989,"maxIndex":{ "value":null},"minIndex":{ "value":null}},{
      "key":"1.14.221.2.25.3.0","doc_count":3989,"maxIndex":{ "value":null},"minIndex":{ "value":null}},{
      "key":"1.14.221.2.30.3.0","doc_count":3989,"maxIndex":{ "value":null},"minIndex":{ "value":null}},{
      "key":"1.14.221.2.35.3.0","doc_count":3989,"maxIndex":{ "value":null},"minIndex":{ "value":null}},{
      "key":"1.14.221.2.40.3.0","doc_count":3989,"maxIndex":{ "value":null},"minIndex":{ "value":null}},{
      "key":"1.14.221.2.45.3.0","doc_count":3989,"maxIndex":{ "value":null},"minIndex":{ "value":null}},{
      "key":"1.14.221.2.5.3.0","doc_count":3989,"maxIndex":{ "value":null},"minIndex":{ "value":null}},{
      "key":"1.14.221.2.50.3.0","doc_count":3989,"maxIndex":{ "value":null},"minIndex":{ "value":null}},{
      "key":"1.14.221.2.55.3.0","doc_count":3989,"maxIndex":{ "value":null},"minIndex":{ "value":null}},{
      "key":"1.19.270.2.1.1.7","doc_count":3920,"maxIndex":{ "value":null},"minIndex":{ "value":null}},{
      "key":"1.19.270.2.1.1.16","doc_count":3875,"maxIndex":{ "value":null},"minIndex":{ "value":null}},{
      "key":"1.19.270.2.1.1.17","doc_count":3852,"maxIndex":{ "value":null},"minIndex":{ "value":null}},{
      "key":"1.24.319.2.60.7.0","doc_count":3851,"maxIndex":{ "value":null},"minIndex":{ "value":null}},{
      "key":"1.14.221.1.60.7.0","doc_count":2889,"maxIndex":{ "value":null},"minIndex":{ "value":null}},{
      "key":"1.24.326.7.10.4.6","doc_count":2501,"maxIndex":{ "value":null},"minIndex":{ "value":null}},{
      "key":"1.24.314.9.2.2.6","doc_count":1330,"maxIndex":{ "value":2.0},"minIndex":{ "value":0.0}},{
      "key":"1.4.54.0.0.0.0","doc_count":1207,"maxIndex":{ "value":null},"minIndex":{ "value":null}},{
      "key":"1.24.319.2.2.2.0","doc_count":437,"maxIndex":{ "value":null},"minIndex":{ "value":null}},{
      "key":"1.12.214.0.0.0.0","doc_count":327,"maxIndex":{ "value":null},"minIndex":{ "value":null}},{
      "key":"1.11.170.1.0.0.0","doc_count":319,"maxIndex":{ "value":null},"minIndex":{ "value":null}},{
      "key":"1.20.287.7.60.7.0","doc_count":296,"maxIndex":{ "value":2.0},"minIndex":{ "value":0.0}},{
      "key":"1.19.270.2.1.1.10","doc_count":229,"maxIndex":{ "value":null},"minIndex":{ "value":null}},{
      "key":"1.19.270.2.1.1.8","doc_count":206,"maxIndex":{ "value":null},"minIndex":{ "value":null}},{
      "key":"1.19.266.2.60.7.0","doc_count":188,"maxIndex":{ "value":null},"minIndex":{ "value":null}},{
      "key":"1.19.265.2.66.13.0","doc_count":182,"maxIndex":{ "value":null},"minIndex":{ "value":null}},{
      "key":"1.19.270.2.60.7.17","doc_count":114,"maxIndex":{ "value":null},"minIndex":{ "value":null}},{
      "key":"1.19.270.2.60.7.18","doc_count":114,"maxIndex":{ "value":null},"minIndex":{ "value":null}},{
      "key":"1.19.270.2.60.7.19","doc_count":114,"maxIndex":{ "value":null},"minIndex":{ "value":null}},{
      "key":"1.19.270.2.1.1.18","doc_count":92,"maxIndex":{ "value":null},"minIndex":{ "value":null}},{
      "key":"1.19.270.2.1.1.19","doc_count":92,"maxIndex":{ "value":null},"minIndex":{ "value":null}},{
      "key":"1.19.270.2.60.7.10","doc_count":92,"maxIndex":{ "value":null},"minIndex":{ "value":null}},{
      "key":"1.19.270.2.60.7.7","doc_count":92,"maxIndex":{ "value":null},"minIndex":{ "value":null}},{
      "key":"1.19.270.2.60.7.8","doc_count":92,"maxIndex":{ "value":null},"minIndex":{ "value":null}},{
      "key":"1.3.50.1.60.7.0","doc_count":92,"maxIndex":{ "value":2.0},"minIndex":{ "value":0.0}},{
      "key":"1.19.270.2.60.7.16","doc_count":91,"maxIndex":{ "value":null},"minIndex":{ "value":null}},{
      "key":"1.11.174.2.1.1.0","doc_count":69,"maxIndex":{ "value":2.0},"minIndex":{ "value":0.0}},{
      "key":"1.14.222.2.5.3.0","doc_count":68,"maxIndex":{ "value":null},"minIndex":{ "value":null}},{
      "key":"1.14.222.2.60.7.0","doc_count":68,"maxIndex":{ "value":null},"minIndex":{ "value":null}},{
      "key":"1.14.223.7.5.3.0","doc_count":68,"maxIndex":{ "value":null},"minIndex":{ "value":null}},{
      "key":"1.19.268.2.60.7.0","doc_count":46,"maxIndex":{ "value":null},"minIndex":{ "value":null}},{
      "key":"1.19.267.2.60.7.0","doc_count":23,"maxIndex":{ "value":null},"minIndex":{ "value":null}},{
      "key":"1.4.56.0.0.0.0","doc_count":18,"maxIndex":{ "value":null},"minIndex":{ "value":null}}]}}}}
      */
  static testHeader = {
    "aggregations":{
      "dataElements":{
      "doc_count":1849878,
      "index":{
      "doc_count_error_upper_bound":0,
      "sum_other_doc_count":0,
      "buckets":[{
      "key":"1.19.265.2.1.1.0","doc_count":45993,"maxIndex":{ "value":3.0},"minIndex":{ "value":0.0}},{
      "key":"1.19.265.7.60.7.0","doc_count":45527,"maxIndex":{ "value":3.0},"minIndex":{ "value":0.0}},{
      "key":"1.19.265.8.60.7.0","doc_count":45527,"maxIndex":{ "value":3.0},"minIndex":{ "value":0.0}},{
      "key":"1.19.265.2.60.7.0","doc_count":45299,"maxIndex":{ "value":3.0},"minIndex":{ "value":0.0}}]}}}}


      static testObs1 = {
        "identifier":"5022759","obsDateTime":"2017-11-23T17:00:00.000Z","receivedDateTime":"2017-11-23T23:46:00.000Z","identity":"/data/msc/observation/atmospheric/surface_weather/ca-1.1-ascii/decoded_qa_enhanced-xml-2.0/201711231700/5022759/wsu/11/orig/data_60/level_1","author":{
        "build":"build.103","name":"MSC-DMS-Merger-Observation","version":"2.3"},"metadataElements":[{
        "elementID":"1.7.392.0.0.0.0","unit":"unitless","name":"MSNG","value":"/data/msc/observation/atmospheric/surface_weather/ca-1.1-ascii/job-xml-2.0/201711231700/5022759/orig/data_60","group":"identification"},{
        "elementID":"1.7.78.0.0.0.0","unit":"datetime","name":"date_tm","value":"2017-11-23T17:00:00.000Z","group":"identification"},{
        "elementID":"1.7.79.0.0.0.0","unit":"unitless","valueNum":11,"name":"snsr_tbl_nbr","value":"11","group":"identification"},{
        "elementID":"1.7.80.0.0.0.0","unit":"unitless","valueNum":1449,"name":"stn_id","value":"1449","group":"identification"},{
        "elementID":"1.7.73.0.0.0.0","unit":"unitless","valueNum":4398,"name":"logr_prg_sig","value":"4398","group":"identification"},{
        "elementID":"1.7.92.0.0.0.0","unit":"min","valueNum":60,"name":"MSNG","value":"60","group":"identification"},{
        "elementID":"1.7.83.0.0.0.0","unit":"unitless","name":"stn_nam","value":"SPRAGUE","group":"identification"},{
        "elementID":"1.7.84.0.0.0.0","unit":"unitless","name":"tc_id","value":"WSU","group":"identification"},{
        "elementID":"1.7.82.0.0.0.0","unit":"unitless","valueNum":71449,"name":"wmo_synop_id","value":"71449","group":"identification"},{
        "elementID":"1.7.87.0.0.0.0","unit":"m","valueNum":328.8,"name":"stn_elev","value":"328.8","group":"identification"},{
        "elementID":"1.7.96.0.0.0.0","unit":"m","valueNum":328.88776,"name":"geoptl_stn_hgt","value":"328.88776","group":"identification"},{
        "elementID":"1.7.x.0.0.0.0","unit":"hPa","valueNum":0,"name":"MSNG","value":"0.0","group":"identification"},{
        "elementID":"1.7.105.0.0.0.0","unit":"unitless","name":"cor","value":"orig","group":"identification"},{
        "elementID":"1.7.408.0.0.0.0","unit":"unitless","valueNum":0,"name":"ver","value":"0","group":"identification"},{
        "elementID":"1.7.81.0.0.0.0","unit":"unitless","name":"data_pvdr","value":"MSC","group":"identification"},{
        "elementID":"1.7.86.0.0.0.0","unit":"unitless","valueNum":5022759,"name":"msc_id","value":"5022759","group":"identification"},{
        "elementID":"1.7.85.0.0.0.0","unit":"unitless","valueNum":5022759,"name":"clim_id","value":"5022759","group":"identification"},{
        "elementID":"1.7.117.0.0.0.0","unit":"unitless","name":"prov","value":"MB","group":"identification"},{
        "elementID":"1.7.97.0.0.0.0","unit":"Â°","valueNum":49.016667,"name":"lat","value":"49.016667","group":"identification"},{
        "elementID":"1.7.98.0.0.0.0","unit":"Â°","valueNum":-95.6,"name":"long","value":"-95.6","group":"identification"},{
        "elementID":"1.7.x.0.0.0.0","unit":"unitless","name":"MSNG","value":"N","group":"identification"},{
        "elementID":"1.7.89.0.0.0.0","unit":"unitless","name":"hly_prdct_flg","value":"Y","group":"identification"},{
        "elementID":"1.7.90.0.0.0.0","unit":"unitless","name":"sm_prdct_flg","value":"Y","group":"identification"},{
        "elementID":"1.7.94.0.0.0.0","unit":"unitless","name":"cs_prdct_flg","value":"N","group":"identification"},{
        "elementID":"1.7.95.0.0.0.0","unit":"unitless","name":"sx_prdct_flg","value":"N","group":"identification"},{
        "elementID":"1.7.x.0.0.0.0","unit":"unitless","name":"MSNG","value":"MSNG","group":"identification"},{
        "elementID":"1.7.91.0.0.0.0","unit":"code","codeSrc":"std_code_src","codeType":"content_indicator","name":"MSNG","value":"data","group":"identification"},{
        "elementID":"1.7.393.0.0.0.0","unit":"unitless","valueNum":-0.002576,"name":"plat_coeff_a","value":"-0.002576","group":"identification"},{
        "elementID":"1.7.394.0.0.0.0","unit":"unitless","valueNum":-0.454112,"name":"plat_coeff_b","value":"-0.454112","group":"identification"},{
        "elementID":"1.7.395.0.0.0.0","unit":"unitless","valueNum":1.019344,"name":"plat_coeff_c","value":"1.019344","group":"identification"},{
        "elementID":"1.7.93.0.0.0.0","unit":"unitless","name":"MSNG","value":"/metadata/msc/qa_package/surface_ca1.1/meta_product-xml-1.0/station/5022759/11010000","group":"identification"},{
        "unit":"unitless","value":"decoded_enhanced-xml-2.0","group":"identification"},{
        "unit":"unitless","value":"decoded_qa_full-xml-2.0","group":"identification"},{
        "unit":"unitless","value":"/data/msc/observation/atmospheric/surface_weather/ca-1.1-ascii/decoded_qa-xml-2.0/201711231700/5022759/wsu/11/orig/data_60/level_1","group":"identification"},{
        "unit":"unitless","value":"/data/msc/observation/atmospheric/surface_weather/ca-1.1-ascii/decoded-xml-2.0/201711231700/5022759/wsu/11/orig/data_60","group":"identification"}],"jsonVersion":1,"location":{
        "coordinates":[-95.6,49.016667,328.8],"type":"point"},"taxonomy":"/msc/observation/atmospheric/surface_weather/ca-1.1-ascii/decoded_qa_enhanced-xml-2.0",
        "dataElements":[
        {
          "elementID": "1.19.265.7.60.7.0",
          "unit":"Â°C",
          "dataType":"official",
          "valueNum":-5.337,
          "name":"max_air_temp_pst1hr",
          "elementIndex":"9",
          "overallQASummary":100,
          "value":"-5.337",
          "indexValue":0,
          "group":"temperature"
        },
        {
          "elementID":"1.19.265.7.60.7.0",
          "unit":"Â°C",
          "valueNum":-5.337,
          "name":"max_air_temp_pst1hr",
          "index":{
            "name":"sensor_index",
            "value":1
          },
          "elementIndex":"9.1",
          "value":"-5.337",
          "indexValue":1,
          "group":"temperature"
        },
        {
          "elementID":"1.19.265.7.60.7.0",
          "unit":"Â°C",
          "name":"max_air_temp_pst1hr",
          "index":{
            "name":"sensor_index",
            "value":2
          },"elementIndex":"9.2",
          "value":"MSNG",
          "indexValue":2,
          "group":"temperature"
        },
        { "elementID":"1.19.265.7.60.7.0","unit":"Â°C","name":"max_air_temp_pst1hr","index":{ "name":"sensor_index","value":3},"elementIndex":"9.3","value":"MSNG","indexValue":3,"group":"temperature"},
        { "elementID":"1.19.265.8.60.7.0","unit":"Â°C","dataType":"official","valueNum":-6.816,"name":"min_air_temp_pst1hr","elementIndex":"10","overallQASummary":100,"value":"-6.816","indexValue":0,"group":"temperature"},
        { "elementID":"1.19.265.8.60.7.0","unit":"Â°C","valueNum":-6.816,"name":"min_air_temp_pst1hr","index":{ "name":"sensor_index","value":1},"elementIndex":"10.1","value":"-6.816","indexValue":1,"group":"temperature"},
        { "elementID":"1.19.265.8.60.7.0","unit":"Â°C","name":"min_air_temp_pst1hr","index":{ "name":"sensor_index","value":2},"elementIndex":"10.2","value":"MSNG","indexValue":2,"group":"temperature"},
        { "elementID":"1.19.265.8.60.7.0","unit":"Â°C","name":"min_air_temp_pst1hr","index":{ "name":"sensor_index","value":3},"elementIndex":"10.3","value":"MSNG","indexValue":3,"group":"temperature"},
        { "elementID":"1.5.66.7.60.7.0","unit":"%","valueNum":95.3,"name":"max_rel_hum_pst1hr","elementIndex":"11","overallQASummary":100,"value":"95.3","group":"humidity"},
        { "elementID":"1.5.66.8.60.7.0","unit":"%","valueNum":92.6,"name":"min_rel_hum_pst1hr","elementIndex":"12","overallQASummary":100,"value":"92.6","group":"humidity"},{
        "elementID":"1.11.169.1.60.7.0","unit":"mm","valueNum":0,"name":"rnfl_amt_pst1hr","elementIndex":"13","overallQASummary":100,"value":"0","group":"precipitation"},{
        "elementID":"1.24.323.0.10.4.6","unit":"Â°","valueNum":173.7,"name":"wnd_dir_10m_pst10mts_max_spd","elementIndex":"56","overallQASummary":100,"value":"173.7","group":"wind"}],"rawMessage":{
        "header":"CACN45 CWAO 231700","message":"WSU 11,2017,327,1700,1449,8.06,100,12.77,12.67,-5.426,92.6,-6.016,-5.337,95.3,-6.816,92.6,1.345,182.1,1.169,181.8,12.67,1.45,191.7,3.077,1648,208.5,2.45,173.7,1.804,175.7,1.126,175.9,169.9,-13.31,472.4,472.4,472.4,472.4,0,0.63,0,0.85,0,1.202,0,1.224,0,472.3,472.2,472.2,472.2,5.178,5.188,5.222,5.238,0,6998,6998,6998,6998,6998,6998,6998,6998,6998,471,472.2,471,472.2,471,472.2,471,472.2,470.9,472.1,470.9,472.2,470.9,472.2,470.9,472.2,4.18,8.37,4.19,8.37,4.214,8.37,4.241,8.4,0,0,0,0,0,4398"},"parentIdentity":"/data/msc/observation/atmospheric/surface_weather/ca-1.1-ascii/decoded-xml-2.0/201711231700/5022759/wsu/11/orig/data_60"}

}
