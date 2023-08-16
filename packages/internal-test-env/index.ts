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
import { join } from "path";
import { config } from "dotenv";
import { Session } from "@inrupt/solid-client-authn-node";
import { getAuthenticatedFetch } from "@jeswr/css-auth-utils";
import merge from "deepmerge-json";
import {
  createContainerInContainer,
  createSolidDataset,
  deleteSolidDataset,
  getPodUrlAll,
  getSourceIri,
  saveSolidDatasetInContainer,
  getSolidDataset,
  setThing,
  getThing,
  setIri,
  saveSolidDatasetAt,
} from "@inrupt/solid-client";
import { isValidUrl } from "./utils";

export const availableEnvironments = [
  "ESS Dev-2-2" as const,
  "ESS Dev-Next" as const,
  "ESS PodSpaces" as const,
  "NSS" as const,
  "CSS" as const,
];

export type AvailableEnvironments = typeof availableEnvironments extends Array<
  infer E
>
  ? E
  : never;

export interface TestingEnvironmentNode extends TestingEnvironmentBase {
  clientCredentials: {
    owner:
      | {
          type: "ESS Client Credentials";
          id: string;
          secret: string;
        }
      | {
          type: "CSS Client Credentials";
          login: string;
          password: string;
          email: string;
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
  environment: AvailableEnvironments;
  idp: string;
  features: FeatureFlags | undefined;
  notificationGateway?: string;
  notificationProtocol?: string;
  vcProvider?: string;
}

type FeatureFlags = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
};
const ENV_FEATURE_PREFIX = "E2E_TEST_FEATURE_";

let envLoaded = false;
export interface EnvVariables {
  // Common Envs
  E2E_TEST_ENVIRONMENT: AvailableEnvironments;
  E2E_TEST_IDP: string;
}

export function setupEnv() {
  // If we're in CI, the environment is already configured. Otherwise, it is
  // loaded once.
  if (process.env.CI || envLoaded) {
    return;
  }
  const envPath = join(process.cwd(), "e2e/env/.env.local");

  // Load dotenv configuration
  config({
    path: envPath,
  });

  if (!process.env.E2E_TEST_ENVIRONMENT) {
    // eslint-disable-next-line no-console
    console.error(
      `We didn't find the given environment variable E2E_TEST_ENVIRONMENT, tried looking in the following directory for '.env.local': ${envPath}`,
    );
  }
  envLoaded = true;
}

export interface LibraryVariables {
  notificationGateway?: boolean;
  notificationProtocol?: boolean;
  vcProvider?: boolean;
  clientCredentials?: {
    owner?: {
      id?: boolean;
      secret?: boolean;
      login?: boolean;
      password?: boolean;
    };
    requestor?: {
      id?: boolean;
      secret?: boolean;
    };
  };
}

export interface BrowserVariables extends LibraryVariables {
  clientCredentials?: {
    owner: {
      login: true;
      password: true;
    };
  };
}

export interface NodeVariables extends LibraryVariables {
  clientCredentials?: {
    owner: {
      id: true;
      secret: true;
    };
  };
}

function validateLibVars(varsToValidate: LibraryVariables): object {
  // Notifications-related environment variables.
  if (varsToValidate.notificationGateway) {
    if (typeof process.env.E2E_TEST_NOTIFICATION_GATEWAY !== "string") {
      throw new Error(
        "Missing the E2E_TEST_NOTIFICATION_GATEWAY environment variable",
      );
    } else if (!isValidUrl(process.env.E2E_TEST_NOTIFICATION_GATEWAY)) {
      throw new Error(
        `Expected E2E_TEST_NOTIFICATION_GATEWAY environment variable to be an IRI, found: ${process.env.E2E_TEST_NOTIFICATION_GATEWAY}`,
      );
    }
  }

  if (varsToValidate.notificationProtocol) {
    if (typeof process.env.E2E_TEST_NOTIFICATION_PROTOCOL !== "string") {
      throw new Error(
        "Missing the E2E_TEST_NOTIFICATION_PROTOCOL environment variable",
      );
    } else if (!isValidUrl(process.env.E2E_TEST_NOTIFICATION_PROTOCOL)) {
      throw new Error(
        `Expected E2E_TEST_NOTIFICATION_PROTOCOL environment variable to be an IRI, found: ${process.env.E2E_TEST_NOTIFICATION_PROTOCOL}`,
      );
    }
  }

  // VC-related environment variables.
  if (varsToValidate.vcProvider) {
    if (typeof process.env.E2E_TEST_VC_PROVIDER !== "string") {
      throw new Error("Missing the E2E_TEST_VC_PROVIDER environment variable");
    } else if (!isValidUrl(process.env.E2E_TEST_VC_PROVIDER)) {
      throw new Error(
        `Expected E2E_TEST_VC_PROVIDER environment variable to be an IRI, found: ${process.env.E2E_TEST_VC_PROVIDER}`,
      );
    }
  }

  // Resource owner static credentials.
  if (
    varsToValidate.clientCredentials?.owner?.id &&
    typeof process.env.E2E_TEST_OWNER_CLIENT_ID !== "string" &&
    process.env.E2E_TEST_OWNER_CLIENT_ID !== "" &&
    process.env.E2E_TEST_ENVIRONMENT !== "CSS"
  ) {
    throw new Error(
      "Missing the E2E_TEST_OWNER_CLIENT_ID environment variable",
    );
  }
  if (
    varsToValidate.clientCredentials?.owner?.secret &&
    typeof process.env.E2E_TEST_OWNER_CLIENT_SECRET !== "string" &&
    process.env.E2E_TEST_OWNER_CLIENT_SECRET !== "" &&
    process.env.E2E_TEST_ENVIRONMENT !== "CSS"
  ) {
    throw new Error(
      "Missing the E2E_TEST_OWNER_CLIENT_SECRET environment variable",
    );
  }
  // Resource requestor static credentials.
  if (
    varsToValidate.clientCredentials?.requestor?.id &&
    typeof process.env.E2E_TEST_REQUESTOR_CLIENT_ID !== "string" &&
    process.env.E2E_TEST_REQUESTOR_CLIENT_ID !== ""
  ) {
    throw new Error(
      "Missing the E2E_TEST_REQUESTOR_CLIENT_ID environment variable",
    );
  }
  if (
    varsToValidate.clientCredentials?.requestor?.secret &&
    typeof process.env.E2E_TEST_REQUESTOR_CLIENT_SECRET !== "string" &&
    process.env.E2E_TEST_REQUESTOR_CLIENT_SECRET !== ""
  ) {
    throw new Error(
      "Missing the E2E_TEST_REQUESTOR_CLIENT_SECRET environment variable",
    );
  }
  // Resource owner username/password.
  if (
    varsToValidate.clientCredentials?.owner?.login &&
    typeof process.env.E2E_TEST_USER !== "string" &&
    process.env.E2E_TEST_USER !== ""
  ) {
    throw new Error("The environment variable E2E_TEST_USER is undefined.");
  }
  if (
    varsToValidate.clientCredentials?.owner?.password &&
    typeof process.env.E2E_TEST_PASSWORD !== "string" &&
    process.env.E2E_TEST_PASSWORD !== ""
  ) {
    throw new Error("The environment variable E2E_TEST_PASSWORD is undefined.");
  }

  return {
    notificationGateway: process.env.E2E_TEST_NOTIFICATION_GATEWAY,
    notificationProtocol: process.env.E2E_TEST_NOTIFICATION_PROTOCOL,
    vcProvider: process.env.E2E_TEST_VC_PROVIDER,
    clientCredentials: {
      owner:
        process.env.E2E_TEST_ENVIRONMENT !== "CSS"
          ? {
              type: "ESS Client Credentials",
              id: process.env.E2E_TEST_OWNER_CLIENT_ID,
              secret: process.env.E2E_TEST_OWNER_CLIENT_SECRET,
              login: process.env.E2E_TEST_USER,
              password: process.env.E2E_TEST_PASSWORD,
            }
          : {
              type: "CSS Client Credentials",
              login: process.env.E2E_TEST_USER,
              password: process.env.E2E_TEST_PASSWORD,
              email: process.env.E2E_TEST_EMAIL,
            },
      requestor: {
        id: process.env.E2E_TEST_REQUESTOR_CLIENT_ID,
        secret: process.env.E2E_TEST_REQUESTOR_CLIENT_SECRET,
      },
    },
  };
}

function getBaseTestingEnvironment<T extends LibraryVariables>(
  libVars?: T,
): T extends NodeVariables
  ? TestingEnvironmentNode
  : TestingEnvironmentBrowser {
  setupEnv();

  // Load and validate target environment name.
  const targetEnvName = process.env.E2E_TEST_ENVIRONMENT;
  if (!availableEnvironments.includes(targetEnvName as AvailableEnvironments)) {
    throw new Error(
      `Unknown environment: [${targetEnvName}]\n\nAvailable environments are ${availableEnvironments
        .map((env) => `[${env}]`)
        .join(", ")}`,
    );
  }

  // Load and validate target OpenID Provider.
  const targetIdp = process.env.E2E_TEST_IDP;
  if (typeof targetIdp !== "string" || !isValidUrl(targetIdp)) {
    throw new Error(
      `The environment variable E2E_TEST_IDP is not a valid URL: found ${targetIdp}.`,
    );
  }

  // Creating feature flag object if there are feature flags
  const features = Object.keys(process.env)
    .filter((envVar) => envVar.startsWith(ENV_FEATURE_PREFIX))
    .reduce((featureFlags, envVar) => {
      // Trim the prefix from the environment variable name.
      const flagName = envVar.substring(ENV_FEATURE_PREFIX.length);
      const flagValue = process.env[envVar];
      return { ...featureFlags, [`${flagName}`]: flagValue };
    }, {});

  const base = {
    idp: targetIdp,
    environment: targetEnvName,
    features,
  };

  return libVars ? merge(base, validateLibVars(libVars)) : base;
}

export function getNodeTestingEnvironment(
  varsToValidate?: LibraryVariables,
): TestingEnvironmentNode {
  return getBaseTestingEnvironment<NodeVariables>(
    merge(varsToValidate, {
      // Enforce client credentials are present for the resource owner.
      clientCredentials: { owner: { id: true, secret: true } },
    }),
  );
}

export function getBrowserTestingEnvironment(
  varsToValidate?: LibraryVariables,
): TestingEnvironmentBrowser {
  return getBaseTestingEnvironment<BrowserVariables>(
    merge(varsToValidate, {
      // Enforce login/password are present for the resource owner.
      clientCredentials: { owner: { login: true, password: true } },
    }),
  );
}

export async function getAuthenticatedSession(
  authDetails: TestingEnvironmentNode,
): Promise<Session> {
  const { owner } = authDetails.clientCredentials;

  if (owner.type === "CSS Client Credentials") {
    return {
      info: {
        isLoggedIn: true,
        // CSS WebIds are always minted in this format
        // with the configs that are currently available
        webId: `${authDetails.idp + owner.login}/profile/card#me`,
        sessionId: "",
      },
      fetch: await getAuthenticatedFetch({
        podName: owner.login,
        password: owner.password,
        url: authDetails.idp,
        email: owner.email,
      }),
      logout() {
        this.info.isLoggedIn = false;
        this.fetch = globalThis.fetch;
      },
    } as Session;
  }

  const session = new Session();

  await session.login({
    oidcIssuer: authDetails.idp,
    clientId: owner.id,
    clientSecret: owner.secret,
  });

  if (!session.info.isLoggedIn) {
    throw new Error("Logging the test agent in failed.");
  }

  return session;
}

// Adds the `pim:storage` triple to a CSS WebId profile document
// as it is not made available by default
export async function addCssPimStorage(
  authDetails: TestingEnvironmentNode,
): Promise<void> {
  const session = await getAuthenticatedSession(authDetails);
  const { webId } = session.info;

  if (!webId) throw new Error("WebId cannot be found in session");

  let dataset = await getSolidDataset(webId, { fetch: session.fetch });
  const thing = getThing(dataset, webId);

  if (!thing)
    throw new Error("WebId cannot be found in WebId profile document");

  dataset = setThing(
    dataset,
    setIri(
      thing,
      "http://www.w3.org/ns/pim/space#storage",
      webId.replace("profile/card#me", ""),
    ),
  );

  await saveSolidDatasetAt(webId, dataset, { fetch: session.fetch });
}

export async function getPodRoot(session: Session) {
  if (!(typeof session.info.webId === "string")) {
    throw new Error("Missing our webid, unable to find PodRoot");
  }
  const podRootAll = await getPodUrlAll(session.info.webId as string);
  if (podRootAll.length === 0) {
    throw new Error(
      `No Pod root were found in the profile associated to [${session.info.webId}]`,
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
  fetchOptions: { fetch: typeof fetch },
) {
  const containerUrl = getSourceIri(
    await createContainerInContainer(podRoot, fetchOptions),
  );
  const resourceUrl = getSourceIri(
    await saveSolidDatasetInContainer(
      containerUrl,
      createSolidDataset(),
      fetchOptions,
    ),
  );
  return { containerUrl, resourceUrl };
}

export async function teardownTestResources(
  session: Session,
  containerUrl: string,
  resourceUrl: string,
  fetchOptions: { fetch: typeof fetch },
) {
  await deleteSolidDataset(resourceUrl, fetchOptions);
  await deleteSolidDataset(containerUrl, fetchOptions);
  await session.logout();
}
