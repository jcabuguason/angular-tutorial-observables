import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SearchService } from './search.service';
import { ParameterType } from './parameters/search-parameter';
import { MessageService } from 'primeng/components/common/messageservice';

@Component({
  selector: 'commons-search',
  templateUrl: './search.component.html',
  styleUrls: [ './search.component.css' ]
})

export class SearchComponent implements OnInit, AfterViewChecked {
  // expanding container for entered search fields
  @ViewChild('paramsContainer') containerElement: ElementRef;
  readonly expandIcon = 'fa fa-caret-down';
  readonly collapseIcon = 'fa fa-caret-up';
  readonly defaultHeight: number = 39;
  readonly defaultContainerHeight: string = '39px';

  showExpandButton = true;
  expandButtonIcon = this.expandIcon;
  expandOnClick = true;
  containerHeight = this.defaultContainerHeight;

  paramType = ParameterType;
  defaultDate = new Date();
  message;

  constructor(
    public translate: TranslateService,
    public searchService: SearchService,
    public messageService: MessageService,
    private changeDectector: ChangeDetectorRef
  ) {
    // this is used to set the time to 00:00 when the calendar/time pops up
    this.defaultDate.setHours(0, 0);
  }

  ngOnInit(): void { }

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
    this.containerHeight = 'auto';
    this.expandButtonIcon = this.collapseIcon;
    this.expandOnClick = false;
  }

  clickExpandButton(expandContainer: boolean) {
    if (expandContainer) {
      this.expandParamsContainer();
    } else {
      this.containerHeight = this.defaultContainerHeight;
      this.expandButtonIcon = this.expandIcon;
      this.expandOnClick = true;
    }
  }

}
