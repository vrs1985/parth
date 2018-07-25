import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-live',
  templateUrl: './live.component.html',
  styleUrls: ['./live.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LiveComponent implements OnInit {

  date = new Date(Date.now()).toLocaleString('en-US', {year: 'numeric', month: 'numeric', day: 'numeric' });
  additional = "+ 4.46%";
  constructor() { }

  ngOnInit() {
  }

}
