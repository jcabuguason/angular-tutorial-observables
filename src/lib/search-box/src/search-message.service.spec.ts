import { TestBed } from '@angular/core/testing';
import { SearchMessageService } from './search-message.service';

describe('SearchMessageService', () => {
  let messageService: SearchMessageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SearchMessageService
      ]
    });

    messageService = TestBed.get(SearchMessageService);
  });

  it('create messages', () => {
    const testValues = ['categoryA with valueA', 'categoryB with valueB'];
    const message = messageService.messageSummaries.cannotAddValue;

    const popupMessage = [{
      severity: 'error',
      summary: message,
      detail: `<li> ${testValues[0]} </li><li> ${testValues[1]} </li>`
    }];

    messageService.displayMessage(message, testValues);

    expect(messageService.popupMessage).toEqual(popupMessage);
  });

  it('clear messages', () => {
    messageService.displayMessage(messageService.messageSummaries.missingRequired, ['']);
    expect(messageService.popupMessage.length).toBeGreaterThan(0);

    messageService.clearMessages();
    expect(messageService.popupMessage.length).toEqual(0);
  });

});
