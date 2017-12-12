import { Component, OnInit } from '@angular/core';

import { StationInfoService } from './station-info.service';

@Component({
  selector: 'commons-station-info',
  templateUrl: './station-info.component.html',
  styleUrls: ['./station-info.component.css']
})
export class StationInfoComponent implements OnInit {

  stationName: string;
  province: string;
  network: string;
  climateID: string;
  tcID: string;
  wmoID: string;
  latitude: string;
  longitude: string;
  elevation: string;

    constructor(private stationService: StationInfoService) {

    }


    ngOnInit() {
      this.stationName = this.stationService.stationName;
      this.province = this.stationService.province;
      this.network = this.stationService.network;
      this.climateID = this.stationService.climateID;
      this.tcID = this.stationService.tcID;
      this.wmoID = this.stationService.wmoID;
      this.latitude = this.stationService.latitude;
      this.longitude = this.stationService.longitude;
      this.elevation = this.stationService.elevation;
    }

}
