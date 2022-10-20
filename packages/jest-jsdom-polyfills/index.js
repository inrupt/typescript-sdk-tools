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

/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-var-requires */

// TextEncoder / TextDecoder APIs are used by Jose, but are not provided by
// jsdom, all node versions supported provide these via the util module
if (
  typeof globalThis.TextEncoder === "undefined" ||
  typeof globalThis.TextDecoder === "undefined"
) {
  const utils = require("util");
  globalThis.TextEncoder = utils.TextEncoder;
  // @ts-ignore TextDecoder from util doesn't necessarily conform to that from
  // the Web APIs, but it's good enough:
  globalThis.TextDecoder = utils.TextDecoder;
  // TextEncoder references a Uint8Array constructor different than the global
  // one used by users in tests. The following enforces the same constructor to
  // be referenced by both.
  globalThis.Uint8Array = Uint8Array;
}

if (
  typeof globalThis.crypto.subtle === undefined
) {
  // Requires OPENSSL_CONF=/dev/null (see https://github.com/nodejs/node/discussions/43184?sort=new) 
  const { Crypto, CryptoKey } = require("@peculiar/webcrypto");
  // jsdom doesn't implement the Web Crypto API
  // For some reason,  this.global.crypto = new Crypto() leaves .subtle undefined
  globalThis.crypto.subtle = (new Crypto()).subtle;
  globalThis.CryptoKey = CryptoKey;
}

// Node.js doesn't support Blob or File, so we're polyfilling those with
// https://github.com/web-std/io
if (typeof globalThis.Blob === "undefined") {
  const stdBlob = require("@web-std/blob");
  globalThis.Blob = stdBlob.Blob;
}

if (typeof globalThis.File === "undefined") {
  const stdFile = require("@web-std/file");
  globalThis.File = stdFile.File;
}
