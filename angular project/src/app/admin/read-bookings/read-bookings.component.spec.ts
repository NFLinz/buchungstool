import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadBookingsComponent } from './read-bookings.component';

describe('ReadBookingsComponent', () => {
  let component: ReadBookingsComponent;
  let fixture: ComponentFixture<ReadBookingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReadBookingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReadBookingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
