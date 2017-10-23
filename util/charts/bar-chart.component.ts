import { Component, Input, NgModule, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
@Component({
  selector: 'commons-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css'],
})
export class BarChartComponent {
  @Input() scheme: object = {domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']};
  @Input() chartData: any[];
  @Input() xAxisLabel: string = 'Observations';
  @Input() yAxisLabel: string = 'Values';
  @Input() legend: boolean;
  @Input() view: number[];
  constructor() {
  }

}

@NgModule({
  declarations: [ BarChartComponent ],
  imports: [ CommonModule, NgxChartsModule ],
  exports: [ BarChartComponent ],
  bootstrap: [ BarChartComponent ]
})
export class BarChartModule { }
