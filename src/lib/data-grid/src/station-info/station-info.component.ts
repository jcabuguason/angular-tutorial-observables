import { Component, Inject} from '@angular/core';
import { MAT_DIALOG_DATA} from '@angular/material/dialog';

export interface StationInterface {
  allData?: {};
}

@Component({
  selector: 'commons-station-info',
  templateUrl: './station-info.component.html',
  styleUrls: ['./station-info.component.css']
})
export class StationComponent {

  allData;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: StationInterface,
  )  { this.allData = data.allData; }
}
