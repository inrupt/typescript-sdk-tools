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

/* eslint-disable @typescript-eslint/no-require-imports */

// TextEncoder / TextDecoder APIs are used by Jose, but are not provided by
// jsdom, all node versions supported provide these via the util module
if (
  typeof globalThis.TextEncoder === "undefined" ||
  typeof globalThis.TextDecoder === "undefined"
) {
  const utils = require("util");
  globalThis.TextEncoder = utils.TextEncoder;
  globalThis.TextDecoder = utils.TextDecoder;
  // TextEncoder references a Uint8Array constructor different than the global
  // one used by users in tests. The following enforces the same constructor to
  // be referenced by both.
  // FIXME: currently this doesn't work, and must be set in a custom environment.
  globalThis.Uint8Array = Uint8Array;
}

if (
  typeof globalThis.crypto !== "undefined" &&
  // jsdom doesn't implement the subtle Web Crypto API
  typeof globalThis.crypto.subtle === "undefined"
) {
  // Requires OPENSSL_CONF=/dev/null (see https://github.com/nodejs/node/discussions/43184)
  const {
    Crypto: WCrypto,
    CryptoKey: WCryptoKey,
  } = require("@peculiar/webcrypto");
  const wcrypto = new WCrypto();
  // We can't use `Object.assign(globalThis.crypto, wcrypto)` here: jsdom's
  // Crypto exposes some own properties (e.g. `Symbol.toStringTag`) as read-only,
  // and @peculiar/webcrypto carries the same keys as own, enumerable properties.
  // Object.assign would attempt to write them onto the read-only target and
  // throw (see https://github.com/inrupt/typescript-sdk-tools/issues). Instead,
  // copy each key individually, skipping any that can't be written on the
  // target. In practice the only property we actually need to polyfill is
  // `subtle`, which jsdom does not implement.
  for (const key of Reflect.ownKeys(wcrypto)) {
    const target = Object.getOwnPropertyDescriptor(globalThis.crypto, key);
    // Skip keys that already exist on the target as non-writable,
    // non-configurable properties (e.g. Symbol.toStringTag on jsdom's Crypto).
    if (target && !target.writable && !target.configurable) {
      continue;
    }
    globalThis.crypto[key] = wcrypto[key];
  }
  globalThis.CryptoKey = WCryptoKey;
}

// jsdom ships its own Blob/File globals, but they are incomplete: their
// prototypes only expose `slice`/`size`/`type` and are missing `text()`,
// `arrayBuffer()` and `stream()`. Worse, undici's `Response.blob()`
// constructs its result from `globalThis.Blob`, so the broken prototype
// leaks into anything that reads a response body as a blob. We therefore
// replace any Blob/File that lacks `text()` with Node's native, spec-compliant
// implementations from `node:buffer` (available on all supported Node versions).
const { Blob: NodeBlob, File: NodeFile } = require("node:buffer");

if (
  typeof globalThis.Blob === "undefined" ||
  typeof globalThis.Blob.prototype.text !== "function"
) {
  globalThis.Blob = NodeBlob;
}

if (
  typeof globalThis.File === "undefined" ||
  typeof globalThis.File.prototype.text !== "function"
) {
  globalThis.File = NodeFile;
}

// FIXME This is a temporary workaround for https://github.com/jsdom/jsdom/issues/1724#issuecomment-720727999
// The following fetch APIs are missing in JSDom

if (
  typeof globalThis.Response === "undefined" ||
  typeof globalThis.Request === "undefined" ||
  typeof globalThis.Headers === "undefined" ||
  typeof globalThis.fetch === "undefined"
) {
  // ReadableStream and MessagePort are required by undici,
  // and are not available in JSDom

  const { ReadableStream } = require("node:stream/web");
  globalThis.ReadableStream = ReadableStream;
  globalThis.MessagePort = require("worker_threads").MessagePort;
  const undici = require("undici");
  globalThis.Response = undici.Response;
  globalThis.Request = undici.Request;
  globalThis.Headers = undici.Headers;
  globalThis.fetch = undici.fetch;
}
