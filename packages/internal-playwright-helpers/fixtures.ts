import { test as base } from "@playwright/test";
import { TestPage } from "./testApp";
import { getBrowserTestingEnvironment } from "@inrupt/internal-test-env";

export type TestOptions = {
  loginOnStart: boolean;
};

export type Fixtures = {
  app: TestPage;
};

export const test = base.extend<Fixtures & TestOptions>({
  loginOnStart: [true, { option: true }],
  app: async ({ page, loginOnStart }, use) => {
    const app = new TestPage(page);
    await app.start()
    if (loginOnStart) {
      const { clientCredentials } = getBrowserTestingEnvironment({
        clientCredentials: {
          owner: { login: "", password: "" },
        },
      });
      await app.loginAndAllow(
        clientCredentials.owner.login,
        clientCredentials.owner.password
      );
    }
    await use(app);
  },
});

export { expect } from "@playwright/test";
