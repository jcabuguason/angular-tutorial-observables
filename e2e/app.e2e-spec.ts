import { MSCDMSCommonsAngularPage } from './app.po';

describe('msc-dms-commons-angular App', () => {
  let page: MSCDMSCommonsAngularPage;

  beforeEach(() => {
    page = new MSCDMSCommonsAngularPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
