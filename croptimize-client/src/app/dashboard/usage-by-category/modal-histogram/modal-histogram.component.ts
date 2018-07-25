import { Component, OnInit, AfterViewInit, Input } from '@angular/core';
import * as Chart from 'chart.js';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

@Component({
  selector: 'app-modal-histogram',
  templateUrl: './modal-histogram.component.html',
  styleUrls: ['./modal-histogram.component.scss']
})
export class ModalHistogramComponent implements OnInit {

  @Input() template;
  

  constructor(private modalService: BsModalService) {}

  ngOnInit() {
  }

  

}
