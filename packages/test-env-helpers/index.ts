//
// Copyright 2022 Inrupt Inc.
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
import { config } from "dotenv-flow";
import { join } from "path";

const availableEnvironment = [
  // "ESS Dev-Next" as const,
  "ESS PodSpaces" as const,
  "ESS PodSpaces Next" as const,
];

export function setupEnv() {
  // If we're in CI, the environment is already configured.
  if (process.env.CI) {
    return;
  }

  // Otherwise load dotenv configuration
  config({
    path: join(__dirname, "..", "env"),
    silent: true,
  });
}

export type AvailableEnvironment = typeof availableEnvironment extends Array<
  infer E
>
  ? E
  : never;

const availableProtocol = ["ESS Notifications Protocol" as const];

export type AvailableProtocol = typeof availableProtocol extends Array<infer E>
  ? E
  : never;

export interface TestingEnvironmentNode {
  environment: AvailableEnvironment;
  idp: string;
  notificationGateway: string;
  protocol: AvailableProtocol;
  clientCredentials: {
    requestor: {
      id: string;
      secret: string;
    };
    resourceOwner: {
      id: string;
      secret: string;
    };
  };
  vcProvider: string;
}

export interface TestingEnvironmentBrowser {
  login: string;
  password: string;
  idp: string;
  notificationGateway: string;
}

export interface EnvVariables {
  // Shared ENV VARS
  E2E_TEST_ENVIRONMENT: AvailableEnvironment;
  E2E_TEST_NOTIFICATION_PROTOCOL: AvailableProtocol;
  E2E_TEST_IDP: string;
  E2E_TEST_NOTIFICATION_GATEWAY: string;

  // Browser login ENV VARS
  E2E_TEST_USER: string | undefined;
  E2E_TEST_PASSWORD: string | undefined;

  // VC service provider
  E2E_TEST_VC_PROVIDER: string | undefined;

  // Client credentials for the access requestor
  E2E_TEST_REQUESTOR_CLIENT_ID: string;
  E2E_TEST_REQUESTOR_CLIENT_SECRET: string;

  // Client credentials for the resource owner
  E2E_TEST_RESOURCE_OWNER_CLIENT_ID: string;
  E2E_TEST_RESOURCE_OWNER_CLIENT_SECRET: string;
}

function getTestingEnvironment(
  environment: unknown
): asserts environment is EnvVariables {
  setupEnv();

  if (
    !availableEnvironment.includes(
      (environment as EnvVariables).E2E_TEST_ENVIRONMENT as AvailableEnvironment
    )
  ) {
    throw new Error(
      `Unknown environment: [${
        (environment as EnvVariables).E2E_TEST_ENVIRONMENT
      }]`
    );
  }

  if (
    !availableProtocol.includes(
      (environment as EnvVariables)
        .E2E_TEST_NOTIFICATION_PROTOCOL as AvailableProtocol
    )
  ) {
    throw new Error(
      `Unknown protocol: [${
        (environment as EnvVariables).E2E_TEST_NOTIFICATION_PROTOCOL
      }]`
    );
  }

  if (typeof (environment as EnvVariables).E2E_TEST_IDP !== "string") {
    throw new Error("The environment variable E2E_TEST_IDP is undefined.");
  }

  if (
    typeof (environment as EnvVariables).E2E_TEST_NOTIFICATION_GATEWAY !==
    "string"
  ) {
    throw new Error(
      "The environment variable E2E_TEST_NOTIFICATION_GATEWAY is undefined."
    );
  }
}

export function getTestingEnvironmentNode(): TestingEnvironmentNode {
  getTestingEnvironment(process.env);

  if (typeof process.env.E2E_TEST_CLIENT_ID !== "string") {
    throw new Error(
      "The environment variable E2E_TEST_CLIENT_ID is undefined."
    );
  }

  if (typeof process.env.E2E_TEST_CLIENT_SECRET !== "string") {
    throw new Error(
      "The environment variable E2E_TEST_CLIENT_SECRET is undefined."
    );
  }

  return {
    idp: process.env.E2E_TEST_IDP,
    environment: process.env.E2E_TEST_ENVIRONMENT,
    protocol: process.env.E2E_TEST_NOTIFICATION_PROTOCOL,
    notificationGateway: process.env.E2E_TEST_NOTIFICATION_GATEWAY,
    clientCredentials: {
      requestor: {
        id: process.env.E2E_TEST_CLIENT_ID,
        secret: process.env.E2E_TEST_CLIENT_SECRET,
      },
      resourceOwner: {
        id: process.env.E2E_TEST_RESOURCE_OWNER_CLIENT_ID,
        secret: process.env.E2E_TEST_RESOURCE_OWNER_CLIENT_SECRET,
      },
    },
  };
}

export function getTestingEnvironmentBrowser(): TestingEnvironmentBrowser {
  getTestingEnvironment(process.env);

  if (process.env.E2E_TEST_USER === undefined) {
    throw new Error("The environment variable E2E_TEST_USER is undefined.");
  }
  if (process.env.E2E_TEST_PASSWORD === undefined) {
    throw new Error("The environment variable E2E_TEST_PASSWORD is undefined.");
  }

  return {
    login: process.env.E2E_TEST_USER,
    password: process.env.E2E_TEST_PASSWORD,
    idp: process.env.E2E_TEST_IDP,
    notificationGateway: process.env.E2E_TEST_NOTIFICATION_GATEWAY,
  };
}

export function getFullTestingEnvironmentNode(): FullTestingEnvironmentNode {
  return getTestingEnvironmentNode();
}
