// Copyright 2020 Inrupt Inc.
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

import type { Page } from "@playwright/test";
import { TESTID_SELECTORS } from "@inrupt/internal-playwright-testids";

export class TestPage {
  page: Page;

  openidProvider: string;

  constructor(page: Page, openidProvider: string) {
    this.page = page;
    this.openidProvider = openidProvider;
  }

  static isOnPage = (url: URL) => url.hostname === "localhost";

  async start(options?: { timeout?: number }) {
    await this.page.goto("/", options);
  }

  async startLogin(options?: { timeout?: number }) {
    await this.page.fill(
      TESTID_SELECTORS.OPENID_PROVIDER_INPUT,
      this.openidProvider,
      options,
    );
    return this.page.click(TESTID_SELECTORS.LOGIN_BUTTON, options);
  }

  async handleRedirect(options?: { timeout?: number }) {
    // Wait for the backchannel exchange
    await this.page.waitForRequest(
      (request) =>
        request.method() === "POST" && request.url().includes("/token"),
      options,
    );
    await this.page.waitForResponse(
      (response) => response.status() === 200,
      options,
    );
  }

  async getErrorStatus(options?: { timeout?: number }) {
    return this.page
      .locator(TESTID_SELECTORS.ERROR_MESSAGE)
      .textContent(options);
  }

  async getSessionStatus(options?: { timeout?: number }) {
    return this.page
      .locator(TESTID_SELECTORS.SESSION_STATUS)
      .textContent(options);
  }
}
