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

import type { Page } from "@playwright/test";
import { CognitoPage } from "../pages/cognito";
import { OpenIdPage } from "../pages/open-id";
import { TestPage } from "../pages/testPage";

export class AuthFlow {
  page: Page;

  openidProvider: string;

  userLogin: string;

  password: string;

  constructor(
    page: Page,
    openidProvider: string,
    userLogin: string,
    password: string,
  ) {
    this.page = page;
    this.openidProvider = openidProvider;
    this.userLogin = userLogin;
    this.password = password;
  }

  /**
   * Start the app, and if applicable initiate login from the client, get redirected
   * to the OpenID provider, log in, allow the client when redirected to the broker,
   * and completes login after being redirected to client.
   */
  async login(
    options: { allow: boolean; timeout?: number } = { allow: true },
  ): Promise<void> {
    const timeoutOptions = { timeout: options.timeout ?? 15_000 };
    const testPage = new TestPage(this.page, this.openidProvider);
    const cognitoPage = new CognitoPage(this.page);
    const openIdPage = new OpenIdPage(this.page);
    // Clicking on the consent screen from the broker will redirect to the
    // test page, and trigger the token request. To prevent this being a
    // race condition, waiting on this request should be done prior to
    // giving consent.
    const completeLoginConditions = [testPage.handleRedirect()];

    // First, initiate login in the test client, and wait for the redirect to the OP
    await Promise.all([
      this.page.waitForURL(
        (url) =>
          // If the user is already authenticated to the OpenID Provider, they may be redirected directly to the broker
          CognitoPage.isOnPage(url) || OpenIdPage.isOnPage(url),
        timeoutOptions,
      ),
      testPage.startLogin(timeoutOptions),
    ]);
    if (CognitoPage.isOnPage(new URL(this.page.url()))) {
      await Promise.all([
        this.page.waitForURL(
          (url: URL) =>
            // After login, the user is redirected either to the broker or to the client.
            OpenIdPage.isOnPage(url) || TestPage.isOnPage(url),
          timeoutOptions,
        ),
        cognitoPage.login(this.userLogin, this.password, timeoutOptions),
      ]);
    }

    // TODO: handle allow === false
    if (options.allow && OpenIdPage.isOnPage(new URL(this.page.url()))) {
      completeLoginConditions.push(openIdPage.allow(timeoutOptions));
    }
    await Promise.all(completeLoginConditions);
  }
}
