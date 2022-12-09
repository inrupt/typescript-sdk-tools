export const TESTID_OPENID_PROVIDER_INPUT = "identityProviderInput";
export const TESTID_LOGIN_BUTTON = "loginButton";
export const TESTID_LOGOUT_BUTTON = "logoutButton";
export const TESTID_ERROR_MESSAGE = "errorMessage";
export const TESTID_SESSION_STATUS = "loggedInMessage";

const buildSelector = (testid: string) => `[data-testid=${testid}]`;

export const TESTID_SELECTORS = {
  OPENID_PROVIDER_INPUT: buildSelector(TESTID_OPENID_PROVIDER_INPUT),
  LOGIN_BUTTON: buildSelector(TESTID_LOGIN_BUTTON),
  LOGOUT_BUTTON: buildSelector(TESTID_LOGOUT_BUTTON),
  ERROR_MESSAGE: buildSelector(TESTID_ERROR_MESSAGE),
  SESSION_STATUS: buildSelector(TESTID_SESSION_STATUS),
};
