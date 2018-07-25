import { Component, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import * as Chart from 'chart.js';

@Component({
  selector: 'app-performance',
  templateUrl: './performance.component.html',
  styleUrls: ['./performance.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PerformanceComponent implements OnInit, AfterViewInit {

  canvas: any;
  ctx: any;

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.canvas = document.getElementById('chartPolar');
    this.ctx = this.canvas.getContext('2d');
    let chart = new Chart(this.ctx, {
      type: 'polarArea',
      data: {
        datasets: [
          { 
            data: [10, 20, 30, 15, 35, 25, 20],
            backgroundColor: [
              '#4e9c4a',
              '#11566f',
              '#f94444',
              '#118ba0',
              '#5da5bd',
              '#991a3d',
              '#11566f'
            ]
          }],
          labels: ["HVAC", "CO2", "LIGHTS", "HEAT", "H2O", "DEHU", "VENTS"]          
      },
      options: {
        legend: {
          display: false
        },
        plugins: {
					datalabels: {
            anchor: 'end',
          }
        }
      }
    });
  }

}
