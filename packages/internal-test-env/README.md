# @inrupt/internal-test-env

This package contains utilities to help setup automated testing environments.

## Installation

1. `npm install --save-dev @inrupt/internal-test-env`

## Usage:

Add the function import as needed.

```js
import "@inrupt/internal-test-env"
```

## Features

This helper exposes the following:

- `getNodeTestingEnvironment`
- `getBrowserTestingEnvironment`

These two functions will load from the environment variables as follows:

- Some variables will always be loaded and validated if applicable
  - `E2E_TEST_ENVIRONMENT`: name of the target environment, used for information purpose.
    E.g., `ESS Dev-Next`
  - `E2E_TEST_IDP`: IRI of the OpenID Provider where the test session will be retrieved.
  - Any environment variable starting with the pattern `E2E_TEST_FEATURE_*` will be
    made available in a feature flags dictionary keyed by `*`. E.g., `E2E_TEST_FEATURE_NOTIFICATIONS`
    being defined will result in `features["NOTIFICATIONS"]` to capture the associated
    value.
- Some variables will only be loaded and validated if explicitly requested as part
  of the `get*TestingEnvironment` call:
  - `E2E_TEST_NOTIFICATION_GATEWAY`
  - `E2E_TEST_NOTIFICATION_PROTOCOL`
  - `E2E_TEST_VC_PROVIDER`
  - `E2E_TEST_OWNER_CLIENT_ID`
  - `E2E_TEST_OWNER_CLIENT_SECRET`
  - `E2E_TEST_REQUESTOR_CLIENT_ID`
  - `E2E_TEST_REQUESTOR_CLIENT_SECRET`
  - `E2E_TEST_USER`
  - `E2E_TEST_PASSWORD`
