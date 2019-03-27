import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyBookingComponent } from './company-booking.component';

describe('CompanyBookingComponent', () => {
  let component: CompanyBookingComponent;
  let fixture: ComponentFixture<CompanyBookingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyBookingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyBookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
