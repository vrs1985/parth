import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-peak-demand',
  templateUrl: './peak-demand.component.html',
  styleUrls: ['./peak-demand.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PeakDemandComponent implements OnInit {

  actual = {
    value: 12213,
    unit: "w"
  };
  peak = {
    value: 12213,
    unit: "w",
    extra: "+4.46%"
  };
  constructor() { }

  ngOnInit() {
  }

}
