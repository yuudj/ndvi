import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HexGridComponent } from './hex-grid.component';

describe('HexGridComponent', () => {
  let component: HexGridComponent;
  let fixture: ComponentFixture<HexGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HexGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HexGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
