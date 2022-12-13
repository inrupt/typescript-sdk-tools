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
import { config } from "dotenv";
import { join } from "path";
import { Session } from "@inrupt/solid-client-authn-node";
import merge from "deepmerge-json";
import {
  createContainerInContainer,
  createSolidDataset,
  deleteSolidDataset,
  getPodUrlAll,
  getSourceIri,
  saveSolidDatasetInContainer,
} from "@inrupt/solid-client";

export const availableEnvironment = [
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

export interface TestingEnvironmentNode extends TestingEnvironmentBase {
  clientCredentials: {
    owner: {
      id: string;
      secret: string;
      login?: string;
      password?: string;
    };
    requestor?: {
      id?: string;
      secret?: string;
    };
  };
}
export interface TestingEnvironmentBrowser extends TestingEnvironmentBase {
  clientCredentials: {
    owner: {
      login: string;
      password: string;
    };
  };
}

export interface TestingEnvironmentBase {
  environment: AvailableEnvironment;
  idp: string;
  features: FeatureFlags | undefined;
  notificationGateway?: string;
  notificationProtocol?: string;
  vcProvider?: string;
}

type FeatureFlags = {
  [key: string]: any;
};
let envLoaded = false;
let featuredFlags: FeatureFlags = {};
export interface EnvVariables {
  // Common Envs
  E2E_TEST_ENVIRONMENT: AvailableEnvironment;
  E2E_TEST_IDP: string;
}

export function setupEnv() {
  // If we're in CI, the environment is already configured.
  if (process.env.CI) {
    return;
  }

  if (envLoaded) {
    return;
  }

  const envPath = join(process.cwd(), "e2e/env/.env.local");

  // Otherwise load dotenv configuration
  config({
    path: envPath,
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
    .filter((envVar) => envVar.startsWith("E2E_TEST_FEATURE_"))
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

  if (typeof (environment as EnvVariables).E2E_TEST_IDP !== "string") {
    throw new Error("The environment variable E2E_TEST_IDP is undefined.");
  }
}

export function getNodeTestingEnvironment(
  libVars?: LibraryVariables
): TestingEnvironmentNode {
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
  }

  const base = {
    idp: process.env.E2E_TEST_IDP,
    environment: process.env.E2E_TEST_ENVIRONMENT,
    clientCredentials: {
      owner: {
        id: process.env.E2E_TEST_OWNER_CLIENT_ID,
        secret: process.env.E2E_TEST_OWNER_CLIENT_SECRET,
      },
    },
    features: featuredFlags,
  };

  return libVars ? merge(base, validateLibVars(libVars)) : base;
}

export interface LibraryVariables {
  notificationGateway?: string;
  notificationProtocol?: string;
  vcProvider?: string;
  clientCredentials?: {
    owner?: {
      id?: string;
      secret?: string;
      login?: string;
      password?: string;
    };
    requestor?: {
      id?: string;
      secret?: string;
    };
  };
}

function validateLibVars(vars: LibraryVariables): object {
  if (
    typeof vars.notificationGateway !== "undefined" &&
    typeof vars.notificationGateway !== "string"
  ) {
    throw new Error(
      "Missing the E2E_TEST_NOTIFICATION_GATEWAY environment variable"
    );
  }
  if (
    vars.clientCredentials?.owner?.id &&
    typeof vars.clientCredentials.owner.id !== "string"
  ) {
    throw new Error(
      "Missing the E2E_TEST_OWNER_CLIENT_ID environment variable"
    );
  }
  if (
    vars.clientCredentials?.owner?.secret &&
    typeof vars.clientCredentials.owner.secret !== "string"
  ) {
    throw new Error(
      "Missing the E2E_TEST_OWNER_CLIENT_SECRET environment variable"
    );
  }

  if (
    vars.clientCredentials?.requestor?.id &&
    typeof vars.clientCredentials.requestor.id !== "string"
  ) {
    throw new Error(
      "Missing the E2E_TEST_REQUESTOR_CLIENT_ID environment variable"
    );
  }
  if (
    vars.clientCredentials?.requestor?.secret &&
    typeof vars.clientCredentials.requestor.secret !== "string"
  ) {
    throw new Error(
      "Missing the E2E_TEST_REQUESTOR_CLIENT_SECRET environment variable"
    );
  }
  if (
    vars.clientCredentials?.owner?.login &&
    typeof vars.clientCredentials.owner.login !== "string"
  ) {
    throw new Error("The environment variable E2E_TEST_USER is undefined.");
  }
  if (
    vars.clientCredentials?.owner?.password &&
    typeof vars.clientCredentials.owner.password !== "string"
  ) {
    throw new Error("The environment variable E2E_TEST_PASSWORD is undefined.");
  }

  return {
    notificationGateway: process.env.E2E_TEST_NOTIFICATION_GATEWAY,
    notificationProtocol: process.env.E2E_TEST_NOTIFICATION_PROTOCOL,
    vcProvider: process.env.E2E_TEST_VC_PROVIDER,
    clientCredentials: {
      owner: {
        id: process.env.E2E_TEST_OWNER_CLIENT_ID,
        secret: process.env.E2E_TEST_OWNER_CLIENT_SECRET,
        login: process.env.E2E_TEST_USER,
        password: process.env.E2E_TEST_PASSWORD,
      },
      requestor: {
        id: process.env.E2E_TEST_REQUESTOR_CLIENT_ID,
        secret: process.env.E2E_TEST_REQUESTOR_CLIENT_SECRET,
      },
    },
  };
}

export function getBrowserTestingEnvironment(
  libVars?: LibraryVariables
): TestingEnvironmentBrowser {
  setupEnv();
  getTestingEnvironment(process.env);

  const base = {
    environment: process.env.E2E_TEST_ENVIRONMENT,
    idp: process.env.E2E_TEST_IDP,
    features: featuredFlags,
    clientCredentials: {
      owner: {
        user: process.env.E2E_TEST_USER,
        password: process.env.E2E_TEST_PASSWORD,
      },
    },
  };
  return libVars ? merge(validateLibVars(libVars), base) : base;
}

export async function getAuthenticatedSession(
  authDetails: TestingEnvironmentNode
): Promise<Session> {
  const session = new Session();

  await session.login({
    oidcIssuer: authDetails.idp,
    clientId: authDetails.clientCredentials.owner.id,
    clientSecret: authDetails.clientCredentials.owner.secret,
  });

  if (!session.info.isLoggedIn) {
    throw new Error("Logging the test agent in failed.");
  }

  return session;
}

export async function getPodRoot(session: Session) {
  if (!(typeof session.info.webId === "string")) {
    throw new Error("Missing our webid, unable to find PodRoot");
  }
  const podRootAll = await getPodUrlAll(session.info.webId as string);
  if (podRootAll.length === 0) {
    throw new Error(
      `No Pod root were found in the profile associated to [${session.info.webId}]`
    );
  }

  // Arbitrarily pick one available Pod root.
  return podRootAll[0];
}

export function createFetch(session: Session, userAgent: string): typeof fetch {
  return (url, options?) => {
    return session.fetch(url, {
      ...options,
      headers: {
        ...options?.headers,
        "User-Agent": userAgent,
      },
    });
  };
}

export async function setupTestResources(
  podRoot: string,
  fetchOptions: { fetch: typeof fetch }
) {
  const containerUrl = getSourceIri(
    await createContainerInContainer(podRoot, fetchOptions)
  );
  const resourceUrl = getSourceIri(
    await saveSolidDatasetInContainer(
      containerUrl,
      createSolidDataset(),
      fetchOptions
    )
  );
  return { containerUrl, resourceUrl };
}

export async function teardownTestResources(
  session: Session,
  containerUrl: string,
  resourceUrl: string,
  fetchOptions: { fetch: typeof fetch }
) {
  await deleteSolidDataset(resourceUrl, fetchOptions);
  await deleteSolidDataset(containerUrl, fetchOptions);
  await session.logout();
}
