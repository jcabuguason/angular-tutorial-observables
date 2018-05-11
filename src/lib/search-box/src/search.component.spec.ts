import { ComponentFixture, TestBed, async, fakeAsync } from '@angular/core/testing';

import { SearchComponent } from './search.component';
import { SearchService } from './search.service';

import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser/';
import { DebugElement } from '@angular/core/src/debug/debug_node';
import { SEARCH_BOX_CONFIG, SearchParameter } from './public_api';

describe('SearchComponent', () => {
  let searchComponent: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;
  let searchService: SearchService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule
      ],
      declarations: [
        SearchComponent
      ],
      providers: [
        SearchService,
        { provide: SEARCH_BOX_CONFIG, useValue: {}}
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
    const box = fixture.debugElement.query(By.css('.advancedSearchBox'));
    expect(box).toBeDefined();

    spyOn(searchService, 'submitSearch');
    spyOn(searchService, 'removeAllSuggestedChoices');
    box.nativeElement.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter'}));
    expect(searchService.submitSearch).toHaveBeenCalled();
    expect(searchService.removeAllSuggestedChoices).toHaveBeenCalled();
  });

  it('searching parameters', () => {
    const input = fixture.debugElement.query(By.css('.search-parameter-input'));
    expect(input).toBeDefined();

    spyOn(searchService, 'showSuggestedParameters');
    spyOn(searchService, 'removeAllSuggestedChoices');

    input.nativeElement.click();
    expect(searchService.removeAllSuggestedChoices).toHaveBeenCalled();

    input.nativeElement.dispatchEvent(new KeyboardEvent('keyup'));
    expect(searchService.showSuggestedParameters).toHaveBeenCalled();
  });

  it('adding suggestions that show up on the bottom', () => {
    const suggestions = fixture.debugElement.query(By.css('.search-parameter-suggestions'));
    expect(suggestions).toBeDefined();

    searchService.suggestedParams = [new SearchParameter('name', [], false, false)];
    fixture.detectChanges();

    const params = fixture.debugElement.query(By.css('.search-parameter-suggestions .search-parameter'));
    expect(params).toBeDefined();

    spyOn(searchService, 'addSuggestedParameter');
    params.nativeElement.click();
    expect(searchService.addSuggestedParameter).toHaveBeenCalled();
  });
});
