import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingstartComponent } from './bookingstart.component';

describe('BookingstartComponent', () => {
  let component: BookingstartComponent;
  let fixture: ComponentFixture<BookingstartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookingstartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookingstartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
