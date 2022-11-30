//
// Copyright 2022 Inrupt Inc.
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

import { Page } from "@playwright/test";
import { CognitoPage } from "./cognito";
import { OpenIdPage } from "./open-id";
import { getBrowserTestingEnvironment } from "@inrupt/internal-test-env";
import {
  TESTID_OPENID_PROVIDER_INPUT,
  TESTID_LOGIN_BUTTON,
  TESTID_ERROR_MESSAGE,
  TESTID_SESSION_STATUS
} from "@inrupt/internal-playwright-testids";

export class TestPage {
  page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async start() {
    await this.page.goto("/");
  }

  private async startLogin() {
    const { idp } = getBrowserTestingEnvironment();
    await this.page.fill(`[data-testid=${TESTID_OPENID_PROVIDER_INPUT}]`, idp);
    await Promise.all([
      // It is important to call waitForNavigation before click to set up waiting.
      this.page.waitForNavigation(),
      // Clicking the link will indirectly cause a navigation.
      this.page.click(`[data-testid=${TESTID_LOGIN_BUTTON}]`),
    ]);
  }

  private async handleRedirect() {
    // Wait for the backchannel exchange
    await this.page.waitForRequest(
      (request) =>
        request.method() === "POST" && request.url().includes("/token")
    );
    await Promise.all([
      this.page.waitForResponse((response) => response.status() === 200),
    ]);
  }

  // TODO: write the loginAndDeny function
  // async loginAndDeny(login: string, password: string): Promise<void> => {};
   async loginAndAllow(
    login: string,
    password: string
  ): Promise<void> {
    const testPage = new TestPage(this.page);
    const cognitoPage = new CognitoPage(this.page);
    const openIdPage = new OpenIdPage(this.page);
  
    // Note: these steps must execute in series, not parallel, which is what
    // Promise.all would do:
    await testPage.startLogin();
    await cognitoPage.login(login, password);
    await openIdPage.allow();
    await testPage.handleRedirect();
  };

  async getErrorStatus() {
    return this.page.locator(
      `[data-testid="${TESTID_ERROR_MESSAGE}"]`
    ).textContent();
  }

  async getSessionStatus() {
    return this.page.locator(
      `[data-testid="${TESTID_SESSION_STATUS}"]`
    ).textContent();
  }
}
