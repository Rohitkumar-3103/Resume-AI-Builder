const https = require("node:https");
const http = require("node:http");

const originalFetch = typeof globalThis !== "undefined" && typeof globalThis.fetch === "function" 
  ? globalThis.fetch 
  : null;

function normalizeHeaders(headers) {
  if (!headers) return {};
  if (typeof headers.forEach === "function") {
    const obj = {};
    headers.forEach((v, k) => {
      obj[k] = v;
    });
    return obj;
  }
  return headers;
}

/**
 * Bulletproof IPv4 fetch polyfill for Node.js
 * Bypasses broken IPv6/NAT64 routing timeouts common on certain ISPs/Wi-Fi adapters
 * that cause undici's 10s connect timeout and "fetch failed" errors.
 * 
 * Localhost/127.0.0.1 requests pass through directly to avoid loopback resolution issues.
 */
function ipv4Fetch(url, options = {}) {
  try {
    const parsedUrl = new URL(url);
    const hostname = parsedUrl.hostname.toLowerCase();
    
    // Pass localhost / loopback calls to original native fetch
    if (originalFetch && (hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1")) {
      return originalFetch(url, options);
    }

    return new Promise((resolve, reject) => {
      const client = parsedUrl.protocol === "https:" ? https : http;
      const reqOptions = {
        method: options.method || "GET",
        headers: normalizeHeaders(options.headers),
        family: 4,
        timeout: 60000
      };

      const req = client.request(parsedUrl, reqOptions, (res) => {
        const chunks = [];
        res.on("data", (chunk) => chunks.push(chunk));
        res.on("end", () => {
          const bodyBuffer = Buffer.concat(chunks);
          const bodyText = bodyBuffer.toString("utf8");
          resolve({
            ok: res.statusCode >= 200 && res.statusCode < 300,
            status: res.statusCode,
            statusText: res.statusMessage || "",
            headers: new Headers(res.headers),
            json: async () => JSON.parse(bodyText),
            text: async () => bodyText,
            blob: async () => new Blob([bodyBuffer])
          });
        });
      });

      req.on("error", reject);
      req.on("timeout", () => {
        req.destroy();
        reject(new Error("Request timed out (60s)"));
      });

      if (options.body) {
        req.write(options.body);
      }
      req.end();
    });
  } catch (err) {
    if (originalFetch) {
      return originalFetch(url, options);
    }
    return Promise.reject(err);
  }
}

// Automatically install as global fetch in Node environment
if (typeof globalThis !== "undefined") {
  globalThis.fetch = ipv4Fetch;
}

module.exports = ipv4Fetch;
