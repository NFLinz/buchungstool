import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HuetteDetailComponent } from './huette-detail.component';

describe('HuetteDetailComponent', () => {
  let component: HuetteDetailComponent;
  let fixture: ComponentFixture<HuetteDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HuetteDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HuetteDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
