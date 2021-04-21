import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const BASEURL = '/core';
const PRODUCT = 'product-json-1.0';
const PRODUCT_INDEX = 7;

@Injectable()
export class RawDataService {
  constructor(private http: HttpClient) {}

  getRawData(uri) {
    return this.http.get(BASEURL + this.createJsonUri(uri));
  }

  createJsonUri(uri) {
    try {
      const arr = uri.split('/');
      arr[PRODUCT_INDEX] = PRODUCT;
      return arr.join('/').replace('/level_1', '');
    } catch {
      console.warn('Invalid URI provided');
    }
  }
}
