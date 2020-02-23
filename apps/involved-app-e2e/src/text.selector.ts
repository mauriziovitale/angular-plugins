import { ElementFinder, element, by } from 'protractor';

export class TextSelector {

  rootElement: ElementFinder = element(by.css(`angular-plugins-text`));
}
