import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadHuettenComponent } from './read-huetten.component';

describe('ReadHuettenComponent', () => {
  let component: ReadHuettenComponent;
  let fixture: ComponentFixture<ReadHuettenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReadHuettenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReadHuettenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
