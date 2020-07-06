import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { formatDateToString, DateFormatOptions } from 'msc-dms-commons-angular/shared/util';
import { formatElementToEsKey } from 'msc-dms-commons-angular/core/obs-util';

import { ELASTIC_SEARCH_CONFIG, ElasticSearchConfig } from './elastic-search.config';
import { ESParams } from './model/es-params.model';
import { ESQueryChunk } from './model/es-query-chunk.model';
import { ESOperator } from './enum/es-operator.enum';
import { URIComponentEncoder } from './uri-component-encoder';

// List of available indicies availble at <server>:9200/_cat/indices
// http://dw-dev1-host01.cmc.ec.gc.ca:9200/_cat/indices
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

  performSearch(version: string, index: string, parameters: ESParams = {}): Observable<any> {
    const params = this.getCommonParams(parameters);
    const options = { params, headers: this.commonHeaders };

    return this.http.get<any>(`${this.config.endpoint}/search/${version}/${index}/templateSearch`, options);
  }

  stringifyQuery(queryChunks: ESQueryChunk[]): string {
    return queryChunks
      .map(this.chunkToString)
      .map((str) => this.wrapString(str, queryChunks.length > 1, '(', ')'))
      .join(ESOperator.And);
  }

  private getCommonParams(parameters: ESParams): HttpParams {
    let params = new HttpParams({ encoder: new URIComponentEncoder() });
    // format as YYYYMMDDHHmm
    const dateFormat: DateFormatOptions = { dateSeparator: '', timeSeparator: '', dateAndTimeSeparator: '' };
    // these if statements are needed to restrict which HttpParams get added or ignored even though it expects CommonESParams
    if (parameters.size != null) {
      params = params.set('size', String(parameters.size));
    }
    if (parameters.from != null) {
      params = params.set('from', formatDateToString(parameters.from, dateFormat));
    }
    if (parameters.to != null) {
      params = params.set('to', formatDateToString(parameters.to, dateFormat));
    }
    if (parameters.sortFields != null) {
      params = params.set('sortFields', parameters.sortFields);
    }
    if (parameters.trackTotalHits != null) {
      params = params.set('trackTotalHits', String(!!parameters.trackTotalHits));
    }
    if (parameters.query != null && this.queryHasOptions(parameters.query)) {
      params = params.set('query', this.stringifyQuery(parameters.query));
    }
    return params;
  }

  private queryHasOptions(queryChunks: ESQueryChunk[]): boolean {
    return queryChunks.length > 0 && queryChunks.every((chunk) => chunk.elements.length > 0);
  }

  private wrapString = (str: string, shouldWrap: boolean, left: string = '\\"', right: string = '\\"') =>
    shouldWrap ? `${left}${str}${right}` : str;

  private formatValue = (given: string, toLowerCase: boolean): string => {
    const wrappedString = given.replace(/\s/g, '\\ ');
    return toLowerCase ? wrappedString.toLowerCase() : wrappedString;
  };

  private chunkToString = (chunk: ESQueryChunk): string => {
    return chunk.elements
      .map(
        (elem) =>
          `${formatElementToEsKey(elem.elementID)}.value${elem.isCaseless ? '.lowercase' : ''}:${this.formatValue(
            elem.value,
            elem.isCaseless,
          )}`,
      )
      .map((str) => this.wrapString(str, chunk.elements.length > 1, '(', ')'))
      .join(chunk.operator);
  };
}
