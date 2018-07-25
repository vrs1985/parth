import { Component, ViewEncapsulation, AfterViewInit, TemplateRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import * as Chart from 'chart.js';

@Component({
  selector: 'app-usage-by-category',
  templateUrl: './usage-by-category.component.html',
  styleUrls: ['./usage-by-category.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UsageByCategoryComponent implements AfterViewInit {

  dataUsage = [
    {name: "lights", value: 3201, unit: "KwH"},
    {name: "hvac", value: 3187, unit: "KwH"},
    {name: "dehu", value: 2794, unit: "KwH"},
    {name: "vents", value: 2287, unit: "KwH"},
    {name: "heat", value: 1876, unit: "KwH"}
  ];

  modalRef: BsModalRef;
  canvas: any;
  ctx: any;
  constructor(private modalService: BsModalService) {}
 
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
    this.drawChartBar();
  }
  
  drawChartBar(){
    this.canvas = document.getElementById('chartVerticalBar');
    this.ctx = this.canvas.getContext('2d');
    let chart = new Chart(this.ctx, {
      type: 'horizontalBar',
      responsive: false,
    data: {
      datasets: [{
        backgroundColor: "#118ba0",
        hoverBorderColor: "#000",
        hoverBorderWidth: 1,
        data: [512, 187, 1216, 1008, 119, 2218, 2761, 602]
        }],
        labels: [
          "Ligths#1",
          "Ligths#2",
          "Ligths#3",
          "Ligths#4",
          "Ligths#5",
          "Ligths#6",
          "Ligths#7",
          "Ligths#8"
        ],
  },
      options: {
        scales: {
          xAxes: [{
            beginAtZero: true
          }],
          yAxes: [{
            stacked: true
          }]
        }
      }
    });
    
  }

  ngAfterViewInit() {    

      }

}
