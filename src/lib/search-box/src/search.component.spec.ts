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
import { ChipsModule } from 'primeng/chips';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { GrowlModule } from 'primeng/growl';
import { InputTextModule } from 'primeng/inputtext';
import { MenuModule } from 'primeng/menu';
import { MessagesModule } from 'primeng/messages';
import { MultiSelectModule } from 'primeng/multiselect';
import { SpinnerModule } from 'primeng/spinner';
import { SearchMessageService } from './search-message.service';
import { SearchURLService } from './search-url.service';
import { MockUrlService, MockMessageService } from './mock-services';

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
        ChipsModule,
        DialogModule,
        DropdownModule,
        GrowlModule,
        InputTextModule,
        MenuModule,
        MessagesModule,
        MultiSelectModule,
        SpinnerModule,
      ],
      declarations: [
        SearchComponent
      ],
      providers: [
        SearchService,
        { provide: SEARCH_BOX_CONFIG, useValue: {} },
        { provide: Location, useValue: { go: () => {}} },
        { provide: SearchMessageService, useClass: MockMessageService },
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

});
