//
// Copyright Inrupt Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal in
// the Software without restriction, including without limitation the rights to use,
// copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the
// Software, and to permit persons to whom the Software is furnished to do so,
// subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
// INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
// PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
// HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
// OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
// SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
//

import { expect, type Page } from "@playwright/test";

/**
 * The Solid-OIDC Broker exposed by ESS wrapped around an underlying OpenID Provider
 */
export class OpenIdPage {
  page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  static isOnPage = (url: URL) => url.hostname.includes("inrupt.com");

  async allow() {
    // Class-based selector that will remain compatible with previous code
    const classBasedSelector = this.page.locator(".allow-button");
    // Testid-based selector that will be compatible with newer releases
    const testidBasedSelector = this.page.getByTestId("prompt-continue");
    // Once we no longer support ESS 2.1, we can remove the class-based selector and only use the testid-based one.
    await expect(classBasedSelector.or(testidBasedSelector)).toBeVisible();
    // Fallback selector to support class attributes, until testid supports is fully deployed.
    const correctSelector = (await testidBasedSelector.isVisible())
      ? testidBasedSelector
      : classBasedSelector;
    return correctSelector.click();
  }

  // TODO: write the deny function
  // async deny() {

  // }
}
