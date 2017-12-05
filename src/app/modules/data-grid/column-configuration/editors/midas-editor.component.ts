import {AfterViewInit, Component, ViewChild, ViewContainerRef} from '@angular/core';

import {ICellEditorAngularComp} from 'ag-grid-angular';

import { QaRendererComponent } from '../renderers/qa-renderer.component';
import { DataFlagRendererComponent } from '../renderers/dataflag-renderer.component';
import { QofRendererComponent } from '../renderers/qof-renderer.component';
import { VofRendererComponent } from '../renderers/vof-renderer.component';

// create your Cell Editor as a Angular component
@Component({
  selector: 'app-midas-edit',
  templateUrl: './midas-editor.component.html',
  styles: [
    '.container { background-color: lightgray;}'
  ]
})
export class MidasEditorComponent implements ICellEditorAngularComp, AfterViewInit {
  public element: any;
  private params: any;

  @ViewChild('container', {read: ViewContainerRef}) public container;

  ngAfterViewInit() {
    setTimeout(() => {
      this.container.element.nativeElement.focus();
    });
  }

  agInit(params: any): void {
    this.params = params;
    this.element = params.node.data[params.taxonomy];
  }

  getValue(): any {
    return this.element;
  }

  isPopup(): boolean {
    return true;
  }

}
