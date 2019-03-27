import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminBookingstartComponent } from './admin-bookingstart.component';

describe('AdminBookingstartComponent', () => {
  let component: AdminBookingstartComponent;
  let fixture: ComponentFixture<AdminBookingstartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminBookingstartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminBookingstartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
