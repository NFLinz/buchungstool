import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyBookingFinalComponent } from './company-booking-final.component';

describe('CompanyBookingFinalComponent', () => {
  let component: CompanyBookingFinalComponent;
  let fixture: ComponentFixture<CompanyBookingFinalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyBookingFinalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyBookingFinalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
