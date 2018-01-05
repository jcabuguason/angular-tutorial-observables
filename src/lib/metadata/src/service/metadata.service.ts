import { Injectable, Injector, Inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';

import { MDDefinition } from '../model/MDDefinition';
import { MDInstanceDefinition } from '../model/MDInstanceDefinition';
import { OutgoingMetadataInstance } from '../model/OutgoingMetadataInstance';
import { MDElement } from '../model/MDElement';
import { MetadataDefinitionList } from '../model/MetadataDefinitionList';
import { MetadataDefinitionHistory } from '../model/MetadataDefinitionHistory';
import { MetadataInstanceHistory } from '../model/MetadataInstanceHistory';
import { MDDefinitionParser } from '../parser/md-definition.parser';
import { MDInstanceDefinitionParser } from '../parser/metadata-instance-definition.parser';
import { METADATA_CONFIG, MetadataConfig } from '../metadata.config';

@Injectable()
export class MetadataService {

  private instanceLinks: {[id: string]: Promise<string[]>}; // Why does Promise work but observable fires multiple times?
  private httpOptions = {withCredentials: true};

  constructor(
    @Inject(METADATA_CONFIG)
    private config: MetadataConfig,
    private http: HttpClient
  ) {
    this.instanceLinks = {};
  }

  loadDefinition(taxonomy: string, version: string) {
    return this.http
      .get(`${this.config.endpoint}/metadata/${taxonomy}/definition-xml-2.0/${version}?format=json`, this.httpOptions)
      .pipe(
        map(response => {
          const definition = MDDefinitionParser.parse(response);
          this.linksFromDefinition(definition.elements);
          return definition;
        })
      );
  }

  loadInstance(taxonomy: string, id: string, version: string) {

    const versionParam = version ? `version=${version}` : '';

    return this.http
      .get(`${this.config.endpoint}/metadata/${taxonomy}/instance-xml-2.0/${id}/?${versionParam}&format=json`, this.httpOptions)
      .pipe(
        map(response => MDInstanceDefinitionParser.parse(response))
      );
  }

  addMetadataInstance(taxonomy: string, outgoing: OutgoingMetadataInstance, id: string) {
    const otherOptions = Object.assign({responseType: 'text'}, this.httpOptions);
    return this.http
      .post(`${this.config.endpoint}/metadata/${taxonomy}/instance-xml-2.0/${id}?format=json`, outgoing, otherOptions);
  }

  updateMetadataInstance(taxonomy: string, outgoing: OutgoingMetadataInstance, id: string) {
    const otherOptions = Object.assign({responseType: 'text'}, this.httpOptions);
    return this.http
      .post(`${this.config.endpoint}/metadata/${taxonomy}/instance-xml-2.0/${id}?format=json&override=true`, outgoing, otherOptions);
  }

  // TODO: load instance links should not be tied to the service singleton
  // it should tied to a taxonomy
  loadInstanceLinks(taxonomy: string) {
    taxonomy = taxonomy.replace('/definition-xml-2.0', '/instance-xml-2.0');

    // TODO: try to change this to observable only
    return this.http
      .get<string>(`${this.config.endpoint}/metadata/instances?dataset=${taxonomy}`, this.httpOptions)
      .toPromise()
      .then((instanceLinks) => {
        const links: string[] = instanceLinks.split('\n');
        links.pop();
        return links;
      })
      .catch(error => {
        return [] as string[];
      });
  }

  getDefinitionList() {
    // TODO: add definitions to MetadataInstanceHistory
    return this.http
      .get<{definitions: MetadataInstanceHistory[]}>(`${this.config.endpoint}/metadata/definitions?dataset=all`, this.httpOptions)
      .pipe(
        map(response => response.definitions)
      );
  }

  getDefinitionHistory(uri: string) {
    const url = `${this.config.endpoint}/metadata/definitions/modification_history?definition_uri=${uri}`;
    return this.http
      .get<MetadataDefinitionHistory[]>(url, this.httpOptions);
  }

  getInstanceHistory(uri: string) {
    const url = `${this.config.endpoint}/metadata/instances/modification_history?instance_uri=${uri}`;
    return this.http
      .get<MetadataInstanceHistory[]>(url, this.httpOptions);
  }

  getInstanceLinks(id: string): Promise<string[]> {
    return this.instanceLinks[id];
  }

  private linksFromDefinition(elements: MDElement[]) {
    for (const element of elements) {
      if (element.format === 'link') {
        this.instanceLinks[element.id] = this.loadInstanceLinks(element.value);
      }

      this.linksFromDefinition(element.elements);
    }
  }
}
