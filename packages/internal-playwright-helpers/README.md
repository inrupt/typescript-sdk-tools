# @inrupt/internal-playwright-helpers

This package contains utilities to help setup automated testing environments.

## Installation

1. `npm install --save-dev @inrupt/internal-playwright-helpers`

## Usage:

Add the function import as needed.

```
import { loginAndAllow } from "@inrupt/internal-playwright-helpers"
```

Then add in calls to the functions such as `loginAndAllow` to your test files.

For these helpers to work, your app should use predefined testids defined in
`@@inrupt/internal-playwright-testids`. The following testids are expected in the
exposed helpers:

- The OpenID provider should be specified in a text input identified with
  `TESTID_OPENID_PROVIDER_INPUT`.
- The login should be initiated by clicking a button identified with
  `TESTID_LOGIN_BUTTON`.
- When the login process is complete, an element identified with
  `TESTID_SESSION_STATUS` should appear in the DOM.
- When an error occurs, an element identified with `TESTID_ERROR_MESSAGE` should
  appear in the DOM.
