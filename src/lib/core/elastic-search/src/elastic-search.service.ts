import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { ELASTIC_SEARCH_CONFIG, ElasticSearchConfig } from './elastic-search.config';
import { BasicObservationsParams } from './model/basic-observations-params.model';
import { UniqueStationsParams } from './model/unique-stations-params.model';
import { ObservationsFromStationsParams } from './model/observations-from-stations-params.model';
import { UniqueElementsParams } from './model/unique-elements-params.model';
import { CommonESParams } from './model/common-es-params.model';
import { ObservationsFromElementsParams } from './model/observations-from-elements-params.model';
import { URIComponentEncoder } from './uri-component-encoder';
import { formatDateToString, DateFormatOptions } from 'msc-dms-commons-angular/shared/util';

@Injectable()
export class ElasticSearchService {
  private commonHeaders: HttpHeaders;

  constructor(
    @Inject(ELASTIC_SEARCH_CONFIG)
    private config: ElasticSearchConfig,
    private http: HttpClient,
  ) {
    this.commonHeaders = new HttpHeaders();
    this.commonHeaders.append('Accept-Encoding', 'gzip');
  }

  getAllSearchableAliases() {
    return this.http
      .get<{ indexes: string[] }>(`${this.config.endpoint}/search/`)
      .pipe(map(response => response.indexes));
  }

  getBasicObservations(version: string, index: string, parameters: BasicObservationsParams = {}): Observable<any> {
    const params = this.getCommonParams(parameters);
    const options = { params, headers: this.commonHeaders };
    return this.http.get<any>(`${this.config.endpoint}/search/${version}/${index}`, options);
  }

  getUniqueStations(version: string, index: string, parameters: UniqueStationsParams = {}): Observable<any> {
    const params = this.getCommonParams(parameters);
    const options = { params, headers: this.commonHeaders };
    return this.http.get<any>(`${this.config.endpoint}/search/${version}/${index}/stations`, options);
  }

  getObservationsFromStations(
    version: string,
    index: string,
    stationList: string[],
    parameters: ObservationsFromStationsParams = {},
  ): Observable<any> {
    const params = this.getCommonParams(parameters);
    const stationListString = stationList.join(',');
    const options = { params, headers: this.commonHeaders };
    return this.http.get<any>(
      `${this.config.endpoint}/search/${version}/${index}/stations/${stationListString}`,
      options,
    );
  }

  getUniqueElements(version: string, index: string, parameters: UniqueElementsParams = {}): Observable<any> {
    const params = this.getCommonParams(parameters);
    const options = { params, headers: this.commonHeaders };
    return this.http.get<any>(`${this.config.endpoint}/search/${version}/${index}/elements`, options);
  }

  getObservationsFromElements(
    version: string,
    index: string,
    elementList: string[],
    parameters: ObservationsFromElementsParams = {},
  ): Observable<any> {
    let params = this.getCommonParams(parameters);
    if (parameters.operator != null) {
      params = params.set('operator', parameters.operator);
    }
    const elementListString = elementList.join(',');
    const options = { params, headers: this.commonHeaders };
    return this.http.get<any>(
      `${this.config.endpoint}/search/${version}/${index}/elements/${elementListString}`,
      options,
    );
  }

  private getCommonParams(parameters: CommonESParams): HttpParams {
    let params = new HttpParams({ encoder: new URIComponentEncoder() });
    // format as YYYYMMDDHHmm
    const dateFormat: DateFormatOptions = { dateSeparator: '', timeSeparator: '', dateAndTimeSeparator: '' };
    // these if statements are needed to restrict which HttpParams get added or ignored even though it expects CommonESParams
    if (parameters.type != null) {
      params = params.set('type', parameters.type);
    }
    if (parameters.size != null) {
      params = params.set('size', String(parameters.size));
    }
    if (parameters.from != null) {
      params = params.set('from', formatDateToString(parameters.from, dateFormat));
    }
    if (parameters.to != null) {
      params = params.set('to', formatDateToString(parameters.to, dateFormat));
    }
    if (parameters.datetimeType != null) {
      params = params.set('datetimeType', parameters.datetimeType);
    }
    if (parameters.sortFields != null) {
      params = params.set('sortFields', parameters.sortFields);
    }
    if (parameters.startIndex != null) {
      params = params.set('startIndex', parameters.startIndex);
    }
    if (parameters.queryType != null) {
      params = params.set('queryType', parameters.queryType);
    }
    return params;
  }
}
