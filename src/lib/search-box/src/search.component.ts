import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SearchService } from './search.service';
import { ParameterType, SearchParameter } from './parameters/search-parameter';
import { MessageService } from 'primeng/components/common/messageservice';
import { NON_SELECTABLE } from './model/choice.model';

@Component({
  selector: 'commons-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent implements OnInit, AfterViewChecked {
  // expanding container for entered search fields
  @ViewChild('paramsContainer') containerElement: ElementRef;
  readonly expandIcon = 'fa fa-caret-down';
  readonly collapseIcon = 'fa fa-caret-up';
  readonly defaultHeight: number = 41;
  readonly defaultContainerHeight: string = '41px';

  showExpandButton = true;
  expandButtonIcon = this.expandIcon;
  expandOnClick = true;
  containerHeight = this.defaultContainerHeight;
  reloadBarParams = true;

  paramType = ParameterType;
  defaultDate = new Date();
  calendarLocale;
  message;
  multiSelectDefaultLabel = '';
  multiSelectSelectedItemsLabel = '';

  private weekdays = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
  private months = [
    'JANUARY',
    'FEBRUARY',
    'MARCH',
    'APRIL',
    'MAY',
    'JUNE',
    'JULY',
    'AUGUST',
    'SEPTEMBER',
    'OCTOBER',
    'NOVEMBER',
    'DECEMBER',
  ];

  constructor(
    public translate: TranslateService,
    public searchService: SearchService,
    public messageService: MessageService,
    private changeDectector: ChangeDetectorRef,
  ) {
    // this is used to set the time to 00:00 when the calendar/time pops up
    this.defaultDate.setHours(0, 0);
  }

  ngOnInit(): void {
    // use labels in current language in case nothing has been emitted by translate.onLangChange before they get created
    this.reloadLabels();

    this.translate.onLangChange.subscribe(() => this.reloadLabels());
    this.searchService.searchConfigUpdated.subscribe(() => this.reloadLabels());
  }

  ngAfterViewChecked(): void {
    this.checkOverflow();
  }

  checkOverflow() {
    const container = this.containerElement.nativeElement;
    if (container != null) {
      this.showExpandButton = this.defaultHeight < container.scrollHeight;
    }
    this.changeDectector.detectChanges();
  }

  expandParamsContainer() {
    this.containerSettings('auto', this.collapseIcon, false);
  }

  clickExpandButton(expandContainer: boolean) {
    expandContainer
      ? this.expandParamsContainer()
      : this.containerSettings(this.defaultContainerHeight, this.expandIcon, true);
  }

  containerSettings(height: string, icon: string, click: boolean) {
    this.containerHeight = height;
    this.expandButtonIcon = icon;
    this.expandOnClick = click;
  }

  // Used for autocomplete w/ i18n
  // SearchParameter checks the original choice.labels on search submit
  // keep filteredSuggestions to match original choice.labels (before translation)
  createSuggestions(event, parameter: SearchParameter) {
    const matchSubstring = (label: string) => label.toLowerCase().includes(event.query.toLowerCase());
    const sortSuggestions = (a: string, b: string) => a.localeCompare(b);

    parameter.filteredSuggestions = parameter
      .getChoices()
      .map(choice => choice.label)
      .filter(label => matchSubstring(this.translate.instant(label)))
      .sort((a, b) => sortSuggestions(this.translate.instant(a), this.translate.instant(b)));
  }

  // Used for multiselect filtering w/ i18n
  // choice.label can be translated string, only need to keep choice.value to match original (before translation)
  adjustMultiSelectChoices() {
    this.searchService.availableParams.forEach(param =>
      param.multiSelectChoices.forEach(choice => (choice.label = this.translate.instant(choice.value))),
    );
  }

  onRangeTypeChange(event) {
    this.searchService.setSelectedRangeType(event.value.value);
  }

  onMultiSelectChange(searchParam: SearchParameter, event) {
    // prevents values like "Loading" from being selected
    const nonSelectableLabels = searchParam
      .getChoices()
      .filter(choice => choice.value === NON_SELECTABLE)
      .map(choice => choice.label);

    if (nonSelectableLabels.includes(event.itemValue)) {
      event.value.pop();
    } else if (!!event.value) {
      this.searchService.onParameterValueChange(searchParam, event.value);
    }
  }

  onDropdownValueChange(searchParam: SearchParameter, event) {
    if (!!event.value) {
      this.searchService.onParameterValueChange(searchParam, event.value);
    }
  }

  private adjustCalendar() {
    const weekdaysShort = this.instantArray(
      'DATES',
      this.weekdays.map(day => `${day}_SHORT`),
    );
    this.calendarLocale = {
      firstDayOfWeek: 1,
      dayNames: this.instantArray('DATES', this.weekdays),
      dayNamesShort: weekdaysShort,
      dayNamesMin: weekdaysShort.map(day => day.substr(0, 2)),
      monthNames: this.instantArray('DATES', this.months),
      monthNamesShort: this.instantArray(
        'DATES',
        this.months.map(month => `${month}_SHORT`),
      ),
      today: this.translate.instant('SEARCH_BAR.TODAY'),
      clear: this.translate.instant('SEARCH_BAR.CLEAR'),
    };
  }

  private adjustMultiSelectLabels() {
    this.multiSelectDefaultLabel = this.translate.instant('SEARCH_BAR.SELECT');
    this.multiSelectSelectedItemsLabel = this.translate.instant('SEARCH_BAR.SELECTED_ITEMS');
  }

  private instantArray = (header, keys) => keys.map(key => this.translate.instant(`${header}.${key}`));

  // Need to reload for multiSelectSelectedItemsLabel to update properly
  private reload(): void {
    this.reloadBarParams = false;
    setTimeout(() => (this.reloadBarParams = true), 1);
  }

  private reloadLabels(): void {
    this.adjustMultiSelectLabels();
    this.adjustMultiSelectChoices();
    this.adjustCalendar();
    this.reload();
  }
}
