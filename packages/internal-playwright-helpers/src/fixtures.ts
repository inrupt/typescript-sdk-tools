import { test as base } from "@playwright/test";
import { getBrowserTestingEnvironment } from "@inrupt/internal-test-env";
import { AuthFlow } from "./flows/auth";

export type AuthFixture = {
  auth: AuthFlow;
};

export const test = base.extend<AuthFixture>({
  // Override the page fixture to start the app automatically
  page: async ({ page }, use) => {
    page.goto("/");
    use(page);
  },
  auth: async ({ page }, use) => {
    const { idp, clientCredentials } = getBrowserTestingEnvironment({
      clientCredentials: {
        owner: { login: "", password: "" },
      },
    });
    const auth = new AuthFlow(
      page,
      idp,
      clientCredentials.owner.login,
      clientCredentials.owner.password
    );
    await use(auth);
  },
});

export { expect } from "@playwright/test";
