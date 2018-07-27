export class MockMessageService {
  messageSummaries = {
    'missingRequired': '',
    'unfilledField': '',
    'cannotAddValue': ''
  };
  displayMessage(messageSummary, values) {}
  clearMessages() {}
}

export class MockUrlService {
  createUrlParams = (params, shortcut) => [];
  getAllRequestParams = (qParams, availableParams, shortcuts) => [];
}
