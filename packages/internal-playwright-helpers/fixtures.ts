import { test as base } from "@playwright/test";
import { TestPage } from "./testApp";
import { getBrowserTestingEnvironment } from "@inrupt/internal-test-env";

export type TestOptions = {
  loginOnStart: boolean;
};

export const test = base.extend<TestOptions>({
  loginOnStart: [true, { option: true }],
  // Override the page fixture to start the app automatically
  page: async ({ page, loginOnStart }, use) => {
    const { idp, clientCredentials } = getBrowserTestingEnvironment({
      clientCredentials: {
        owner: { login: "", password: "" },
      },
    });
    const app = new TestPage(page, idp);
    await app.start()
    if (loginOnStart) {
      
      await app.loginAndAllow(
        clientCredentials.owner.login,
        clientCredentials.owner.password
      );
    }
    await use(page);
  },
});

export { expect } from "@playwright/test";
