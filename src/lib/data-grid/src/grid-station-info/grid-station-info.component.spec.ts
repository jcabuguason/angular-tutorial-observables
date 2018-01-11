import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GridStationInfoComponent } from './grid-station-info.component';

describe('GridStationInfoComponent', () => {
  let component: GridStationInfoComponent;
  let fixture: ComponentFixture<GridStationInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GridStationInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridStationInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
