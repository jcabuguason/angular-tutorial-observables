import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA } from '@angular/material';
import { By } from '@angular/platform-browser/';
import { StationInfoComponent } from './station-info.component';

import {TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import {CombinedHttpLoader} from 'msc-dms-commons-angular/shared/language';
import {HttpClient} from '@angular/common/http';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('StationInfoComponent', () => {
  let component: StationInfoComponent;
  let fixture: ComponentFixture<StationInfoComponent>;

  const data = {
    allData: [
      { key: 'station', value: 'StationA' },
      { key: 'msc_id', value: '1234567' }
    ]
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: (httpClient) => new CombinedHttpLoader(httpClient, [{ prefix : '../../../../assets/i18n/', suffix: '.json'}]),
            deps: [HttpClient]
          }
        })
      ],
      declarations: [ StationInfoComponent ],
      providers: [
        TranslateService,
        { provide: MAT_DIALOG_DATA, useValue: data},
      ]
    }).compileComponents()
    .then(() => {
      fixture = TestBed.createComponent(StationInfoComponent);
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
