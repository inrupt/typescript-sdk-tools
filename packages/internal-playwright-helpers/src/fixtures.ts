import { Page, test as base } from "@playwright/test";
import { getBrowserTestingEnvironment } from "@inrupt/internal-test-env";
import { TestPage } from "./pages/testApp";
import { OpenIdPage } from "./pages/open-id";
import { CognitoPage } from "./pages/cognito";

export type TestOptions = {
  loginOnStart: boolean;
};

/**
 * Start the app, initiate login from the client, get redirected to the OpenID
 * provider, log in, allow the client when redirected to the broker, and 
 * completes login after being redirected to client.
 */
const login = async (
  page: Page,
  openidProvider: string,
  login: string,
  password: string
): Promise<void> => {
  const cognitoPage = new CognitoPage(page);
  const openIdPage = new OpenIdPage(page);
  const testPage = new TestPage(page, openidProvider);

  // Note: these steps must execute in series, not parallel, which is what
  // Promise.all would do:
  await testPage.start()
  await testPage.startLogin();
  await cognitoPage.login(login, password);
  await openIdPage.allow();
  await testPage.handleRedirect();
};

// TODO: write the loginAndDeny function
// async loginAndDeny(login: string, password: string): Promise<void> => {};

export const test = base.extend<TestOptions>({
  loginOnStart: [true, { option: true }],
  // Override the page fixture to start the app automatically
  page: async ({ page, loginOnStart }, use) => {
    const { idp, clientCredentials } = getBrowserTestingEnvironment({
      clientCredentials: {
        owner: { login: "", password: "" },
      },
    });
    if (loginOnStart) {
      await login(
        page,
        idp,
        clientCredentials.owner.login,
        clientCredentials.owner.password
      );
    } else {
      // Even if the app doesn't need to log in initially, it should still start.
      const app = new TestPage(page, idp);
      await app.start()
    }
    await use(page);
  },
});

export { expect } from "@playwright/test";
