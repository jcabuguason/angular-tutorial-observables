import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

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

@Injectable()
export class ElasticSearchService {

  constructor(
    @Inject(ELASTIC_SEARCH_CONFIG)
    private config: ElasticSearchConfig,
    private http: HttpClient
  ) { }

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
    return this.http.get<any>(`${this.config.endpoint}/search/${version}/${index}`, { params });
  }

  getUniqueStations(
    version: string,
    index: string,
    parameters: UniqueStationsParams = {}
  ): Observable<any> {
    const params = this.getCommonParams(parameters);
    return this.http.get<any>(`${this.config.endpoint}/search/${version}/${index}/stations`, { params });
  }

  getObservationsFromStations(
    version: string,
    index: string,
    stationList: string[],
    parameters: ObservationsFromStationsParams = {}
  ): Observable<any> {
    const params = this.getCommonParams(parameters);
    const stationListString = stationList.join(',');
    return this.http.get<any>(`${this.config.endpoint}/search/${version}/${index}/stations/${stationListString}`, { params });
  }

  getUniqueElements(
    version: string,
    index: string,
    parameters: UniqueElementsParams = {}
  ): Observable<any> {
    const params = this.getCommonParams(parameters);
    return this.http.get<any>(`${this.config.endpoint}/search/${version}/${index}/elements`, { params });
  }

  getObservationsFromElements(
    version: string,
    index: string,
    elementList: string[],
    parameters: ObservationsFromElementsParams = {}
  ): Observable<any> {
    const params = this.getCommonParams(parameters);
    const elementListString = elementList.join(',');
    return this.http.get<any>(`${this.config.endpoint}/search/${version}/${index}/elements/${elementListString}`, { params });
  }

  private getCommonParams(parameters: CommonElasticSearchParams): HttpParams {
    let params = new HttpParams();
    if (parameters.type != null) {
      params = params.set('type', parameters.type);
    }
    else if (parameters.size != null) {
      params = params.set('size', String(parameters.size));
    }
    else if (parameters.from != null) {
      params = params.set('from', format(parameters.from, 'YYYYMMDDHHmm'));
    }
    else if (parameters.to != null) {
      params = params.set('to', format(parameters.to, 'YYYYMMDDHHmm'));
    }
    else if (parameters.datetimeType != null) {
      params = params.set('datetimeType', parameters.datetimeType);
    }
    else if (parameters.sortFields != null) {
      params = params.set('sortFields', parameters.sortFields);
    }
    else if (parameters.startIndex != null) {
      params = params.set('startIndex', parameters.startIndex);
    }
    else if (parameters.includeAggregations != null) {
      params = params.set('includeAggregations', String(parameters.includeAggregations));
    }
    return params;
  }
}
