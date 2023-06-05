import {
  __privateAdd,
  __privateGet,
  __privateSet,
  __publicField
} from "../chunk-GUTKD5ZG.js";
var _keyPairs, _sharedKey, _listeners, _encrypt, _decrypt, _sign, _verify;
import util from "tweetnacl-util";
import nacl from "tweetnacl";
const _PostMessage = class {
  constructor({ keyPairs, encrypt, decrypt, sign, verify }) {
    __privateAdd(this, _keyPairs, void 0);
    __privateAdd(this, _sharedKey, void 0);
    __privateAdd(this, _listeners, void 0);
    __privateAdd(this, _encrypt, void 0);
    __privateAdd(this, _decrypt, void 0);
    __privateAdd(this, _sign, void 0);
    __privateAdd(this, _verify, void 0);
    __publicField(this, "target");
    __publicField(this, "origin");
    __publicField(this, "publicKeys");
    __privateSet(this, _keyPairs, keyPairs);
    __privateSet(this, _encrypt, encrypt);
    __privateSet(this, _decrypt, decrypt);
    __privateSet(this, _sign, sign);
    __privateSet(this, _verify, verify);
    __privateSet(this, _listeners, /* @__PURE__ */ new Map());
    window.addEventListener("beforeunload", async () => {
      await this.disconnect();
    });
  }
  static generateSharedKey({ keyPairs, publicKeys }) {
    const baseEncryptionPublicKey = util.decodeBase64(publicKeys.encryption);
    const baseEncryptionSecretKey = util.decodeBase64(keyPairs.encryption.secretKey);
    const uintSharedKey = nacl.box.before(baseEncryptionPublicKey, baseEncryptionSecretKey);
    const baseSharedKey = util.encodeBase64(uintSharedKey);
    return baseSharedKey;
  }
  accept({ url }) {
    return new Promise((resolve, reject) => {
      const origin = new URL(url).origin;
      const handler = (event) => {
        if (event.data.type !== "connect")
          return;
        if (event.origin !== origin)
          return;
        if (!event.data.publicKeys)
          return;
        event.source.postMessage({
          type: "connected",
          publicKeys: {
            signing: __privateGet(this, _keyPairs).signing.publicKey,
            encryption: __privateGet(this, _keyPairs).encryption.publicKey
          }
        }, event.origin);
        this.target = window.opener;
        this.origin = event.origin;
        this.publicKeys = event.data.publicKeys;
        __privateSet(this, _sharedKey, _PostMessage.generateSharedKey({ keyPairs: __privateGet(this, _keyPairs), publicKeys: this.publicKeys }));
        window.removeEventListener("message", handler);
        resolve(this);
      };
      window.addEventListener("message", handler);
    });
  }
  connect({ url }) {
    return new Promise((resolve, reject) => {
      const origin = new URL(url).origin;
      const target = window.open(url, origin);
      if (!target)
        return reject(new Error("Failed to open window"));
      const interval = setInterval(() => {
        target.postMessage({
          type: "connect",
          publicKeys: {
            signing: __privateGet(this, _keyPairs).signing.publicKey,
            encryption: __privateGet(this, _keyPairs).encryption.publicKey
          }
        }, origin);
      }, 1e3);
      const handler = (event) => {
        if (event.origin !== origin)
          return;
        if (event.data.type !== "connected")
          return;
        if (!event.data.publicKeys)
          return;
        this.target = target;
        this.origin = origin;
        this.publicKeys = event.data.publicKeys;
        __privateSet(this, _sharedKey, _PostMessage.generateSharedKey({ keyPairs: __privateGet(this, _keyPairs), publicKeys: this.publicKeys }));
        window.removeEventListener("message", handler);
        clearInterval(interval);
        resolve(this);
      };
      window.addEventListener("message", handler);
    });
  }
  disconnect() {
    return new Promise((resolve, reject) => {
      const handleDisconnect = (event) => {
        if (event.source === this.target && event.origin === this.origin && event.data === "disconnectConfirmation") {
          window.removeEventListener("message", handleDisconnect);
          resolve(true);
        }
      };
      window.addEventListener("message", handleDisconnect);
      this.target.postMessage({ type: "disconnect" }, this.origin);
    });
  }
  send(data) {
    if (!this.target)
      throw new Error("not connected yet");
    const ciphertext = __privateGet(this, _encrypt).call(this, { data, sharedKey: __privateGet(this, _sharedKey) });
    const signature = __privateGet(this, _sign).call(this, { data: ciphertext, detached: true });
    return new Promise((resolve, reject) => {
      const handleMessage = (event) => {
        if (event.source === this.target && event.origin === this.origin && event.data === "messageConfirmation") {
          window.removeEventListener("message", handleMessage);
          resolve(true);
        }
      };
      window.addEventListener("message", handleMessage);
      this.target.postMessage({ type: "message", message: { ciphertext, signature } }, this.origin);
    });
  }
  on(eventType, callback) {
    const allowed = ["message", "connected", "disconnect"];
    if (!allowed.includes(eventType))
      return;
    const listener = (event) => {
      if (event.source === this.target && event.origin === this.origin && event.data?.type === eventType) {
        const message = event.data?.type === "message" ? __privateGet(this, _decrypt).call(this, { data: event.data.message, sharedKey: __privateGet(this, _sharedKey) }) : event.data.message;
        callback(message);
      }
    };
    __privateGet(this, _listeners).set(callback, listener);
    window.addEventListener("message", listener);
  }
};
let PostMessage = _PostMessage;
_keyPairs = new WeakMap();
_sharedKey = new WeakMap();
_listeners = new WeakMap();
_encrypt = new WeakMap();
_decrypt = new WeakMap();
_sign = new WeakMap();
_verify = new WeakMap();
export {
  PostMessage
};
