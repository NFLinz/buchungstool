import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCompanyBookingComponent } from './admin-company-booking.component';

describe('AdminCompanyBookingComponent', () => {
  let component: AdminCompanyBookingComponent;
  let fixture: ComponentFixture<AdminCompanyBookingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminCompanyBookingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminCompanyBookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
