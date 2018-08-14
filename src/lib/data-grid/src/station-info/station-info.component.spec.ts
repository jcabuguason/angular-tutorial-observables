import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA } from '@angular/material';
import { By } from '@angular/platform-browser/';
import { StationComponent } from './station-info.component';

describe('ElementDataflagInfoDialogComponent', () => {
  let component: StationComponent;
  let fixture: ComponentFixture<StationComponent>;

  const data = {
    allData: [
      { key: 'station', value: 'StationA' },
      { key: 'msc_id', value: '1234567' }
    ]
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StationComponent ],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: data},
      ]
    }).compileComponents()
    .then(() => {
      fixture = TestBed.createComponent(StationComponent);
      component = fixture.componentInstance;
    });
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create table', () => {
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('.mat-table')) != null).toBeTruthy();
    expect(fixture.debugElement.queryAll(By.css('.mat-row')).length).toEqual(2);
  });

});
