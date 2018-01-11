import { AfterViewInit, Component, ViewChild, ViewContainerRef} from '@angular/core';

import { ICellEditorAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'commons-grid-station-info',
  templateUrl: './grid-station-info.component.html',
  styleUrls: ['./grid-station-info.component.css']
})
export class GridStationInfoComponent implements ICellEditorAngularComp, AfterViewInit {
  public identities: any;
  private params: any;

  @ViewChild('container', {read: ViewContainerRef}) public container;

  constructor() {
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.container.element.nativeElement.focus();
    });
  }

  agInit(params: any) {
    this.params = params;
    this.identities = {};
    this.getKeySet(params.node.data).forEach(key => {
      if (!key.startsWith('e_')) {
        this.identities[key] = params.node.data[key];
      }
    });
  }

  getValue(): any {
    return this.params.value;
  }

  isPopup(): boolean {
    return true;
  }

  getKeySet(obj: object): string[] {
    return Object.keys(obj);
  }
}
