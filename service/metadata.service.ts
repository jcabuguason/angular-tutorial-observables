import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Store } from '@ngrx/store';
import { Http, Headers } from '@angular/http';
import 'rxjs/Rx';

import { MDDefinition } from '../object/metadata/MDDefinition';
import { MDInstanceDefinition } from '../object/metadata/MDInstanceDefinition';
import { OutgoingMetadataInstance } from '../object/metadata-form/OutgoingMetadataInstance';
import { MetadataFormParser } from '../parser/metadata-form.parser';
import { MetadataForm } from '../object/metadata-form/MetadataForm';
import { PegasusStore } from '../store/pegasus.store';
import { MDElement } from '../object/metadata/MDElement';
import { MetadataDefinitionList } from '../object/metadata/MetadataDefinitionList';
import { MetadataDefinitionHistory } from '../object/metadata/MetadataDefinitionHistory';
import { MetadataInstanceHistory } from '../object/metadata/MetadataInstanceHistory';

const BASEURL = 'http://localhost:3000';

@Injectable()
export class MetadataService {
  definition$: Observable<MDDefinition>;
  instance$: Observable<MDInstanceDefinition>;
  definition: MDDefinition;
  instance: MDInstanceDefinition;
  instanceLinks: {[id: string]: Promise<string[]>}; // Why does Promise work but observable fires multiple times?
  subscriptions: Subscription[];
  // TODO: Dictionary Object?

  constructor(
    private http: Http,
    private store: Store<PegasusStore>
  ) {
    this.definition$ = store.select('metadataDefinition');
    this.instance$ = store.select('metadataInstance');
    this.definition$.subscribe(d => this.definition = d);
    this.instance$.subscribe(i => this.instance = i);
    this.instanceLinks = {};
    this.subscriptions = [];
  }

  loadDefinition(taxonomy: string, version: string, username: string) {
    const user_header = new Headers();
    user_header.append('Content-Type', 'application/json');
    user_header.append('username', username);

    this.http.get(`${BASEURL}/metadata/${taxonomy}/definition-xml-2.0/${version}?format=json`)
      .toPromise()
      .then(result => {
        result = result.json();
        const action = ({type: 'LOAD_DEFINITION', payload: result});
        this.store.dispatch(action);
      });

    this.linksFromDefinition(username);
  }

  loadInstance(taxonomy: string, id: string, version: string, username: string) {
    const user_header = new Headers();
    user_header.append('Content-Type', 'application/json');
    user_header.append('username', username);

    this.http.get(`${BASEURL}/metadata/${taxonomy}/instance-xml-2.0/${id}/?${version}&format=json`)
      .toPromise()
      .then(result => {
        result = result.json();
        const action = ({type: 'LOAD_INSTANCE', payload: result});
        this.store.dispatch(action);
      });
  }

  addMetadataInstance(taxonomy: string, form: MetadataForm, username: string) {
    const payload = MetadataFormParser.parseToOutgoing(form, this.definition);
    const id = this.getIDs(form);
    const user_header = new Headers();
    user_header.append('Content-Type', 'application/json');
    user_header.append('username', username);

    return this.http.post(`${BASEURL}/metadata/${taxonomy}/instance-xml-2.0/${id}?format=json`,
      payload, { headers: user_header}).toPromise()
  }

  updateMetadataInstance(taxonomy: string, form: MetadataForm, username: string) {
    const payload = MetadataFormParser.parseToOutgoing(form, this.definition);
    const id = this.getIDs(form);
    const user_header = new Headers();
    user_header.append('Content-Type', 'application/json');
    user_header.append('username', username);

    return this.http.post(`${BASEURL}/metadata/${taxonomy}/instance-xml-2.0/${id}?format=json&override=true`,
      payload, { headers: user_header}).toPromise()
  }

  loadInstanceLinks(taxonomy: string, username: string) {
    taxonomy = taxonomy.replace('/definition-xml-2.0', '/instance-xml-2.0');
    const user_header = new Headers();
    user_header.append('Content-Type', 'application/json');
    user_header.append('username', username);

    const loadedLinks = this.http
      .get(`${BASEURL}/metadata/instances?dataset=${taxonomy}`)
      .map(res => res.json())
      .toPromise()
      .then((instanceLinks: string) => {
        const links: string[] = instanceLinks.split('\n');
        links.pop();
        return links;
      });
    return loadedLinks;
  }

  getDefinitionList() {
    return this.http
      .get(`${BASEURL}/metadata/definitions?dataset=all`)
      .toPromise()
      .then(result => {
        return result.json().definitions as MetadataDefinitionList[];
      });
  }

  getDefinitionHistory(uri: string) {
    return this.http
      .get(`${BASEURL}/metadata/definitions/modification_history?definition_uri=${uri}`)
      .toPromise()
      .then(result => {
        return result.json() as MetadataDefinitionHistory[];
      });
  }

  getInstanceHistory(uri: string) {
    return this.http
      .get(`${BASEURL}/metadata/instances/modification_history?instance_uri=${uri}`)
      .toPromise()
      .then(result => {
        return result.json() as MetadataInstanceHistory[];
      });
  }

  resetMetadata(): void {
    this.store.dispatch({type: 'RESET', payload: this.definition});
    this.store.dispatch({type: 'RESET', payload: this.instance});

    // unsubscribe to all subscriptions
    this.subscriptions.forEach((subscription: Subscription) => {
      subscription.unsubscribe();
    });
    this.subscriptions = [];
  }

  linksFromDefinition(username: string) {
    const subscription = this.definition$
      .filter(definition => definition != null)
      .subscribe((definition: MDDefinition) => {
        this.linksFromDefinitionHelper(definition.elements, username);
      });

    this.subscriptions.push(subscription);
  }

  getInstanceLinks(id: string): Promise<string[]> {
    return this.instanceLinks[id];
  }

  private linksFromDefinitionHelper(elements: MDElement[], username: string) {
    for (const element of elements) {
      if (element.format === 'link') {
        this.instanceLinks[element.id] = this.loadInstanceLinks(element.value, username);
      }

      this.linksFromDefinitionHelper(element.elements, username);
    }
  }

  private getIDs(form: MetadataForm): string {
    return form.elements
    .filter(e => e.multiple[0] != null)
    .filter(e => e.multiple[0].uriParameter != null)
    .sort((a, b) => {
      if (a.multiple[0].uriParameter < b.multiple[0].uriParameter) {
        return -1;
      } else if (a.multiple[0].uriParameter > b.multiple[0].uriParameter) {
        return 1;
      } else {
        return 0;
      }
    })
    .map(e => e.multiple[0].valueGroup.value)
    .join('/');
  }
}
