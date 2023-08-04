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
