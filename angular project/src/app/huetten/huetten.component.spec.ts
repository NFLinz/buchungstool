import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HuettenComponent } from './huetten.component';

describe('HuettenComponent', () => {
  let component: HuettenComponent;
  let fixture: ComponentFixture<HuettenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HuettenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HuettenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
