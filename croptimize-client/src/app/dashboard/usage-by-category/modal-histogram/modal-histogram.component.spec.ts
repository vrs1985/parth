import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalHistogramComponent } from './modal-histogram.component';

describe('ModalHistogramComponent', () => {
  let component: ModalHistogramComponent;
  let fixture: ComponentFixture<ModalHistogramComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalHistogramComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalHistogramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
