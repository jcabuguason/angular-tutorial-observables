import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

import { format } from 'date-fns';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';

import { ELASTIC_SEARCH_CONFIG, ElasticSearchConfig } from './elastic-search.config';
import { ElasticSearchDateTimeType } from './model/elastic-search-date-time-type.model';
import { BasicObservationsParams } from './model/basic-observations-params.model';
import { UniqueStationsParams } from './model/unique-stations-params.model';
import { ObservationsFromStationsParams } from './model/observations-from-stations-params.model';
import { UniqueElementsParams } from './model/unique-elements-params.model';
import { CommonElasticSearchParams } from './model/common-elastic-search-params.model';
import { ObservationsFromElementsParams } from './model/observations-from-elements-params.model';
import { URIComponentEncoder } from './uri-component-encoder';

@Injectable()
export class ElasticSearchService {

  private commonHeaders: HttpHeaders;

  constructor(
    @Inject(ELASTIC_SEARCH_CONFIG)
    private config: ElasticSearchConfig,
    private http: HttpClient
  ) {
    this.commonHeaders = new HttpHeaders();
    this.commonHeaders.append('Accept-Encoding', 'gzip');
  }

  getAllSearchableAliases() {
    return this.http
      .get<{indexes: string[]}>(`${this.config.endpoint}/search/`)
      .pipe(
        map(response => response.indexes)
      );
  }

  getBasicObservations(
    version: string,
    index: string,
    parameters: BasicObservationsParams = {}
  ): Observable<any> {
    const params = this.getCommonParams(parameters);
    const options = { params, headers: this.commonHeaders };
    return this.http.get<any>(`${this.config.endpoint}/search/${version}/${index}`, options);
  }

  getUniqueStations(
    version: string,
    index: string,
    parameters: UniqueStationsParams = {}
  ): Observable<any> {
    const params = this.getCommonParams(parameters);
    const options = { params, headers: this.commonHeaders };
    return this.http.get<any>(`${this.config.endpoint}/search/${version}/${index}/stations`, options);
  }

  getObservationsFromStations(
    version: string,
    index: string,
    stationList: string[],
    parameters: ObservationsFromStationsParams = {}
  ): Observable<any> {
    const params = this.getCommonParams(parameters);
    const stationListString = stationList.join(',');
    const options = { params, headers: this.commonHeaders };
    return this.http.get<any>(`${this.config.endpoint}/search/${version}/${index}/stations/${stationListString}`, options);
  }

  getUniqueElements(
    version: string,
    index: string,
    parameters: UniqueElementsParams = {}
  ): Observable<any> {
    const params = this.getCommonParams(parameters);
    const options = { params, headers: this.commonHeaders };
    return this.http.get<any>(`${this.config.endpoint}/search/${version}/${index}/elements`, options);
  }

  getObservationsFromElements(
    version: string,
    index: string,
    elementList: string[],
    parameters: ObservationsFromElementsParams = {}
  ): Observable<any> {
    let params = this.getCommonParams(parameters);
    if (parameters.operator != null) {
      params = params.set('operator', parameters.operator);
    }
    const elementListString = elementList.join(',');
    const options = { params, headers: this.commonHeaders };
    return this.http.get<any>(`${this.config.endpoint}/search/${version}/${index}/elements/${elementListString}`, options);
  }

  private getCommonParams(parameters: CommonElasticSearchParams): HttpParams {
    const params = {};
    Object.keys(parameters)
      .filter(key => parameters[key] != null)
      .forEach(key => {
        let value = parameters[key];
        if (key === 'size') {
          value = String(value);
        } else if (key === 'from' || key === 'to') {
          value = format(value, 'YYYYMMDDHHmm');
        }
        params[key] = value;
      });

    return new HttpParams({encoder: new URIComponentEncoder(), fromObject: params});
  }
}
