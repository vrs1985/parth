import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-optimization',
  templateUrl: './optimization.component.html',
  styleUrls: ['./optimization.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class OptimizationComponent implements OnInit {

  private optimizations: Array<object> = [
    {name: "Operational Adjustments", icon: "clock", link: ""},
    {name: "Demand Improvements", icon: "light", link: ""},
    {name: "Supply Improvements", icon: "battery", link: ""},
  ];
  constructor() { }

  ngOnInit() {
  }

}
