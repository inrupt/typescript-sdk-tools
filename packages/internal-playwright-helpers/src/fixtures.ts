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
import { test as base } from "@playwright/test";
import { getBrowserTestingEnvironment } from "@inrupt/internal-test-env";
import { AuthFlow } from "./flows/auth";

export type AuthFixture = {
  auth: AuthFlow;
};

export const test = base.extend<AuthFixture>({
  // Override the page fixture to start the app automatically
  page: async ({ page }, use) => {
    await page.goto("/");
    await use(page);
  },
  auth: async ({ page }, use) => {
    const { idp, clientCredentials } = getBrowserTestingEnvironment({
      clientCredentials: {
        owner: { login: true, password: true },
      },
    });
    const auth = new AuthFlow(
      page,
      idp,
      clientCredentials.owner.login,
      clientCredentials.owner.password,
    );
    await use(auth);
  },
});

export { expect } from "@playwright/test";
