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
import { Session } from "@inrupt/solid-client-authn-node";
import {
  createContainerInContainer,
  createSolidDataset,
  deleteSolidDataset,
  getPodUrlAll,
  getSourceIri,
  saveSolidDatasetInContainer,
} from "@inrupt/solid-client";

const availableEnvironment = [
  "ESS Dev-Next" as const,
  "ESS PodSpaces" as const,
  "NSS" as const,
  //  "ESS PodSpaces Next" as const,
];

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
  notificationGateway: string | undefined;
  protocol: AvailableProtocol | undefined;
  clientCredentials: {
    requestor: {
      id: string;
      secret: string;
    };
    resourceOwner: {
      id: string | undefined;
      secret: string | undefined;
    };
  };
  vcProvider: string | undefined;
  features: FeatureFlags | undefined;
}
export interface TestingEnvironmentBrowser {
  clientCredentials: {
    resourceOwner: {
      login: string;
      password: string;
    };
  };
  idp: string;
  notificationGateway: string | undefined;
  features: FeatureFlags | undefined;
}

type FeatureFlags = {
  [key: string]: any;
};

export interface EnvVariables {
  // Common Envs
  E2E_TEST_ENVIRONMENT: AvailableEnvironment;
  E2E_TEST_IDP: string;
  E2E_TEST_USER: string;
  E2E_TEST_PASSWORD: string;

  // Client credentials for the access requestor
  E2E_TEST_REQUESTOR_CLIENT_ID: string;
  E2E_TEST_REQUESTOR_CLIENT_SECRET: string;

  // Needed for solid-notifications-js
  E2E_TEST_NOTIFICATION_GATEWAY: string | undefined;
  E2E_TEST_NOTIFICATION_PROTOCOL: AvailableProtocol | undefined;

  // VC service provider
  E2E_TEST_VC_PROVIDER: string | undefined;

  // Client credentials for the resource owner
  E2E_TEST_RESPONDER_CLIENT_ID: string | undefined;
  E2E_TEST_RESPONDER_CLIENT_SECRET: string | undefined;

  E2E_TEST_FEATURE_ACP: boolean | undefined;
  E2E_TEST_FEATURE_ACP_V3: boolean | undefined;
  E2E_TEST_FEATURE_WAC: boolean | undefined;
}

let envLoaded = false;
let featuredFlags: FeatureFlags = {};

export function setupEnv() {
  // If we're in CI, the environment is already configured.
  if (process.env.CI) {
    return;
  }

  if (envLoaded) {
    return;
  }

  const envPath = join(process.cwd(), "e2e/env");

  // Otherwise load dotenv configuration
  config({
    path: envPath,
    silent: true,
  });

  if (!process.env.E2E_TEST_ENVIRONMENT) {
    console.error(
      `We didn't find the given environment variable E2E_TEST_ENVIRONMENT,
tried looking in the following directory for \`.env.local \`: 
${envPath}`
    );
  }

  // Creating feature flag object if there are feature flags
  Object.keys(process.env)
    .filter((envVar) => /E2E_TEST_FEATURE.*/.test(envVar))
    .forEach((key) => (featuredFlags[key] = process.env[key]));
  // Marking env as loaded
  envLoaded = true;
}

function getTestingEnvironment(
  environment: unknown
): asserts environment is EnvVariables {
  // Populate your process.env from your .env file of choice

  // TODO: Replace these inline validations and checks with envalid or env-var
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

export function getNodeTestingEnvironment(): TestingEnvironmentNode {
  setupEnv();
  getTestingEnvironment(process.env);

  if (
    process.env.E2E_TEST_REQUESTOR_CLIENT_ID !== undefined ||
    process.env.E2E_TEST_REQUESTOR_CLIENT_SECRET !== undefined
  ) {
    if (typeof process.env.E2E_TEST_REQUESTOR_CLIENT_ID !== "string") {
      throw new Error(
        "The environment variable E2E_TEST_REQUESTOR_CLIENT_ID is undefined."
      );
    }

    if (typeof process.env.E2E_TEST_REQUESTOR_CLIENT_SECRET !== "string") {
      throw new Error(
        "The environment variable E2E_TEST_REQUESTOR_CLIENT_SECRET is undefined."
      );
    }

    if (typeof process.env.E2E_TEST_VC_PROVIDER !== "string") {
      throw new Error(
        "The environment variable E2E_TEST_VC_PROVIDER is undefined."
      );
    }
  }
  if (
    process.env.E2E_TEST_RESOURCE_OWNER_CLIENT_ID !== undefined ||
    process.env.E2E_TEST_RESOURCE_OWNER_CLIENT_SECRET !== undefined
  ) {
    if (typeof process.env.E2E_TEST_RESOURCE_OWNER_CLIENT_ID !== "string") {
      throw new Error(
        "The environment variable E2E_TEST_RESOURCE_OWNER_CLIENT_ID is undefined."
      );
    }
    if (typeof process.env.E2E_TEST_REQUESTOR_CLIENT_SECRET !== "string") {
      throw new Error(
        "The environment variable E2E_TEST_REQUESTOR_CLIENT_SECRET is undefined."
      );
    }
  }

  return {
    idp: process.env.E2E_TEST_IDP,
    environment: process.env.E2E_TEST_ENVIRONMENT,
    protocol: process.env.E2E_TEST_NOTIFICATION_PROTOCOL,
    notificationGateway: process.env.E2E_TEST_NOTIFICATION_GATEWAY,
    clientCredentials: {
      requestor: {
        id: process.env.E2E_TEST_REQUESTOR_CLIENT_ID,
        secret: process.env.E2E_TEST_REQUESTOR_CLIENT_SECRET,
      },
      resourceOwner: {
        id: process.env.E2E_TEST_RESOURCE_OWNER_CLIENT_ID,
        secret: process.env.E2E_TEST_RESOURCE_OWNER_CLIENT_SECRET,
      },
    },
    vcProvider: process.env.E2E_TEST_VC_PROVIDER,
    features: featuredFlags,
  };
}

export function getBrowserTestingEnvironment(): TestingEnvironmentBrowser {
  setupEnv();
  getTestingEnvironment(process.env);

  if (process.env.E2E_TEST_USER === undefined) {
    throw new Error("The environment variable E2E_TEST_USER is undefined.");
  }
  if (process.env.E2E_TEST_PASSWORD === undefined) {
    throw new Error("The environment variable E2E_TEST_PASSWORD is undefined.");
  }

  return {
    clientCredentials: {
      resourceOwner: {
        login: process.env.E2E_TEST_USER,
        password: process.env.E2E_TEST_PASSWORD,
      },
    },
    idp: process.env.E2E_TEST_IDP,
    notificationGateway: process.env.E2E_TEST_NOTIFICATION_GATEWAY,
    features: featuredFlags,
  };
}

export async function getAuthenticatedSession(
  authDetails: TestingEnvironmentNode
): Promise<Session> {
  const session = new Session();
  await session.login({
    oidcIssuer: authDetails.idp,
    clientId: authDetails.clientCredentials.resourceOwner.id,
    clientSecret: authDetails.clientCredentials.resourceOwner.secret,
  });

  if (!session.info.isLoggedIn) {
    throw new Error("Logging the test agent in failed.");
  }

  return session;
}

export async function getPodRoot(session: Session) {
  const podRootAll = await getPodUrlAll(session.info.webId as string);
  if (podRootAll.length === 0) {
    throw new Error(
      `No Pod root were found in the profile associated to [${session.info.webId}]`
    );
  }

  // Arbitrarily pick one available Pod root.
  return podRootAll[0];
}

export async function setupTestResources(
  session: Session,
  userAgent: string,
  podRoot: string
) {
  // Set the user agent to something distinctive to make debug easier
  const fetchWithAgent: typeof fetch = (url, options?) => {
    return session.fetch(url, {
      ...options,
      headers: {
        ...options?.headers,
        "User-Agent": userAgent,
      },
    });
  };
  const containerUrl = getSourceIri(
    await createContainerInContainer(podRoot, {
      fetch: fetchWithAgent,
      // When running the test from CI, use a random container name to avoid collision.
      // It could be useful to give the container a distinctive name when running the
      // tests locally though, so that the Pod is easier to inspect.
      slugSuggestion: process.env.CI === "true" ? undefined : userAgent,
    })
  );
  const resourceUrl = getSourceIri(
    await saveSolidDatasetInContainer(containerUrl, createSolidDataset(), {
      fetch: fetchWithAgent,
    })
  );
  return { containerUrl, resourceUrl, fetchWithAgent };
}

export async function teardownTestResources(
  session: Session,
  containerUrl: string,
  resourceUrl: string,
  userAgentFetch: typeof fetch
) {
  await deleteSolidDataset(resourceUrl, { fetch: userAgentFetch });
  await deleteSolidDataset(containerUrl, { fetch: userAgentFetch });
  await session.logout();
}
