import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'pegasus-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css']
})
export class BarChartComponent {
  @Input() chartData: any[] = [];
  @Input() view: number[] = [];
  @Input() xAxisLabel: string = 'Observations';
  @Input() yAxisLabel: string = 'Values';
  @Input() legend: boolean;
  @Input() scheme: string[] = [];

  constructor() {
  }
}
