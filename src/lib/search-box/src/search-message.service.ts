export class SearchMessageService {
  // Any messages that should show up based on user input
  // popup and form message use different modules and will display slightlty differently
  popupMessage = [];
  formMessage = [];

  messageSummaries = {
    'missingRequired': 'Missing required search fields:',
    'unfilledField': 'Fields added but do not have a value or correct format (note: Invalid values could have been automatically removed):',
    'cannotAddValue': 'Could not add:'
  };

  constructor() {}

  displayMessage(messageSummary: string, values: string[]) {
    this.addMessage(this.popupMessage, messageSummary, this.listDetail(values));
  }

  clearMessages() {
    this.popupMessage = [];
    this.formMessage = [];
  }

  private listDetail = (values) => values.map(val => `<li> ${val} </li>`).join('');

  private addMessage = (list, message, details) => list.push({severity: 'error', summary: message, detail: details});
}
