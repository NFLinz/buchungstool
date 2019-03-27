import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CloseddaysComponent } from './closeddays.component';

describe('CloseddaysComponent', () => {
  let component: CloseddaysComponent;
  let fixture: ComponentFixture<CloseddaysComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CloseddaysComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CloseddaysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
