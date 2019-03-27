import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CloseddaysCreateComponent } from './closeddays-create.component';

describe('CloseddaysCreateComponent', () => {
  let component: CloseddaysCreateComponent;
  let fixture: ComponentFixture<CloseddaysCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CloseddaysCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CloseddaysCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
