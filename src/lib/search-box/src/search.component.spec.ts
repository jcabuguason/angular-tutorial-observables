import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Location } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { SearchComponent } from './search.component';
import { SearchService } from './search.service';

import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser/';
import { SEARCH_BOX_CONFIG } from './public_api';

import { AccordionModule } from 'primeng/accordion';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { ChipsModule } from 'primeng/chips';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { MenuModule } from 'primeng/menu';
import { MessagesModule } from 'primeng/messages';
import { MultiSelectModule } from 'primeng/multiselect';
import { SpinnerModule } from 'primeng/spinner';
import { SearchURLService } from './search-url.service';
import { MockUrlService, MockMessageService } from './mock-services';
import { MessageService } from 'primeng/components/common/messageservice';

import {TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import {CombinedHttpLoader} from 'msc-dms-commons-angular/shared/language';
import {HttpClient} from '@angular/common/http';
import {HttpClientTestingModule} from '@angular/common/http/testing';

import { SearchParameter } from './parameters/search-parameter';
import { ChoiceModel } from './model/choice.model';

describe('SearchComponent', () => {
  let searchComponent: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;
  let searchService: SearchService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        BrowserAnimationsModule,
        AccordionModule,
        AutoCompleteModule,
        ButtonModule,
        CalendarModule,
        CheckboxModule,
        ChipsModule,
        DialogModule,
        DropdownModule,
        ToastModule,
        InputTextModule,
        MenuModule,
        MessagesModule,
        MultiSelectModule,
        SpinnerModule,
        HttpClientTestingModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: (httpClient) => new CombinedHttpLoader(httpClient, [{ prefix : '../../../assets/i18n/', suffix: '.json'}]),
            deps: [HttpClient]
          }
        }),
      ],
      declarations: [
        SearchComponent
      ],
      providers: [
        TranslateService,
        SearchService,
        MessageService,
        { provide: SEARCH_BOX_CONFIG, useValue: {} },
        { provide: Location, useValue: { go: () => {}} },
        { provide: SearchURLService, useClass: MockUrlService },
      ]
    }).compileComponents()
    .then(() => {
      fixture = TestBed.createComponent(SearchComponent);
      searchComponent = fixture.componentInstance;
      searchService = fixture.debugElement.injector.get(SearchService);
    });
  }));

  it('should create', () => {
    expect(searchComponent).toBeDefined();
  });

  it('pressing enter on search box', () => {
    const box = fixture.debugElement.query(By.css('.search-container'));
    expect(box.nativeElement).toBeDefined();

    spyOn(searchService, 'submitSearch');
    box.nativeElement.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter'}));
    expect(searchService.submitSearch).toHaveBeenCalled();
  });

  it('should check expand button', () => {
    spyOn(searchComponent, 'checkOverflow');
    fixture.detectChanges();
    expect(searchComponent.checkOverflow).toHaveBeenCalled();
  });

  it('should return filtered suggestions', () => {
    const choices = [
      new ChoiceModel('mscLabel', 'mscUri', 'mscTooltip'),
      new ChoiceModel('dndLabel', 'dndUri'),
      new ChoiceModel('ncLabel', 'ncUri'),
    ];
    const param = new SearchParameter('param', choices, false, false);

    fixture.componentInstance.createSuggestions({'query': 'C'}, param);
    expect(param.filteredSuggestions).toEqual([choices[0].label, choices[2].label]);

    fixture.componentInstance.createSuggestions({'query': 'msc'}, param);
    expect(param.filteredSuggestions).toEqual([choices[0].label]);
  });

});
