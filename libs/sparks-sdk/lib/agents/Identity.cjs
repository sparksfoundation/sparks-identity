"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }



var _chunkSIAYTN4Tcjs = require('../chunk-SIAYTN4T.cjs');
var _keyPairs, _identifier, _keyEventLog, _connections;
var _tweetnaclutil = require('tweetnacl-util'); var _tweetnaclutil2 = _interopRequireDefault(_tweetnaclutil);
var _blake3 = require('@noble/hashes/blake3');
var _tweetnacl = require('tweetnacl'); var _tweetnacl2 = _interopRequireDefault(_tweetnacl);
class Identity {
  constructor() {
    _chunkSIAYTN4Tcjs.__privateAdd.call(void 0, this, _keyPairs, void 0);
    _chunkSIAYTN4Tcjs.__privateAdd.call(void 0, this, _identifier, void 0);
    _chunkSIAYTN4Tcjs.__privateAdd.call(void 0, this, _keyEventLog, void 0);
    _chunkSIAYTN4Tcjs.__privateAdd.call(void 0, this, _connections, []);
  }
  __parseJSON(string) {
    if (typeof string !== "string")
      return null;
    try {
      return JSON.parse(string);
    } catch (e) {
      return null;
    }
  }
  get connections() {
    return _chunkSIAYTN4Tcjs.__privateGet.call(void 0, this, _connections);
  }
  get identifier() {
    return _chunkSIAYTN4Tcjs.__privateGet.call(void 0, this, _identifier);
  }
  get keyEventLog() {
    return _chunkSIAYTN4Tcjs.__privateGet.call(void 0, this, _keyEventLog);
  }
  get publicKeys() {
    return {
      signing: _chunkSIAYTN4Tcjs.__privateGet.call(void 0, this, _keyPairs).signing.publicKey,
      encryption: _chunkSIAYTN4Tcjs.__privateGet.call(void 0, this, _keyPairs).encryption.publicKey
    };
  }
  incept({ keyPairs, nextKeyPairs, backers = [] }) {
    if (_chunkSIAYTN4Tcjs.__privateGet.call(void 0, this, _identifier) || _optionalChain([_chunkSIAYTN4Tcjs.__privateGet.call(void 0, this, _keyEventLog), 'optionalAccess', _ => _.length])) {
      throw Error("Identity already incepted");
    }
    if (!keyPairs) {
      throw new Error("Key pairs required for inception");
    }
    if (!nextKeyPairs) {
      throw new Error("Next signing key commitment required for inception");
    }
    _chunkSIAYTN4Tcjs.__privateSet.call(void 0, this, _keyPairs, keyPairs);
    const identifier = `B${_chunkSIAYTN4Tcjs.__privateGet.call(void 0, this, _keyPairs).signing.publicKey.replace(/=$/, "")}`;
    const publicSigningKey = _chunkSIAYTN4Tcjs.__privateGet.call(void 0, this, _keyPairs).signing.publicKey;
    const nextKeyHash = _tweetnaclutil2.default.encodeBase64(_blake3.blake3.call(void 0, _tweetnaclutil2.default.decodeBase64(nextKeyPairs.signing.publicKey)));
    const inceptionEvent = {
      identifier,
      eventIndex: "0",
      eventType: "inception",
      signingThreshold: "1",
      signingKeys: [publicSigningKey],
      nextKeyCommitments: [nextKeyHash],
      backerThreshold: "1",
      backers: [...backers]
    };
    const eventJSON = JSON.stringify(inceptionEvent);
    const version = "KERI10JSON" + eventJSON.length.toString(16).padStart(6, "0") + "_";
    const hashedEvent = _tweetnaclutil2.default.encodeBase64(_blake3.blake3.call(void 0, eventJSON));
    const signedEventHash = this.sign({ data: hashedEvent, detached: true });
    inceptionEvent.version = version;
    inceptionEvent.selfAddressingIdentifier = signedEventHash;
    _chunkSIAYTN4Tcjs.__privateSet.call(void 0, this, _identifier, identifier);
    _chunkSIAYTN4Tcjs.__privateSet.call(void 0, this, _keyEventLog, [inceptionEvent]);
  }
  rotate({ keyPairs, nextKeyPairs, backers = [] }) {
    if (!_chunkSIAYTN4Tcjs.__privateGet.call(void 0, this, _identifier) || !_optionalChain([_chunkSIAYTN4Tcjs.__privateGet.call(void 0, this, _keyEventLog), 'optionalAccess', _2 => _2.length])) {
      throw Error("Keys can not be rotated before inception");
    }
    if (!keyPairs) {
      throw new Error("Key pairs required for rotation");
    }
    if (!nextKeyPairs) {
      throw new Error("Next signing key committment required for rotation");
    }
    if (_chunkSIAYTN4Tcjs.__privateGet.call(void 0, this, _keyEventLog)[_chunkSIAYTN4Tcjs.__privateGet.call(void 0, this, _keyEventLog).length - 1].eventType === "destruction") {
      throw new Error("Keys can not be rotated after destruction");
    }
    _chunkSIAYTN4Tcjs.__privateSet.call(void 0, this, _keyPairs, keyPairs);
    const oldKeyEvent = _chunkSIAYTN4Tcjs.__privateGet.call(void 0, this, _keyEventLog)[_chunkSIAYTN4Tcjs.__privateGet.call(void 0, this, _keyEventLog).length - 1];
    const publicSigningKey = _chunkSIAYTN4Tcjs.__privateGet.call(void 0, this, _keyPairs).signing.publicKey;
    const nextKeyHash = _tweetnaclutil2.default.encodeBase64(_blake3.blake3.call(void 0, _tweetnaclutil2.default.decodeBase64(nextKeyPairs.signing.publicKey)));
    const rotationEvent = {
      identifier: _chunkSIAYTN4Tcjs.__privateGet.call(void 0, this, _identifier),
      eventIndex: (parseInt(oldKeyEvent.eventIndex) + 1).toString(),
      eventType: "rotation",
      signingThreshold: oldKeyEvent.signatureThreshold,
      signingKeys: [publicSigningKey],
      nextKeyCommitments: [nextKeyHash],
      backerThreshold: oldKeyEvent.backerThreshold,
      backers: [...backers]
    };
    const eventJSON = JSON.stringify(rotationEvent);
    const version = "KERI10JSON" + eventJSON.length.toString(16).padStart(6, "0") + "_";
    const hashedEvent = _tweetnaclutil2.default.encodeBase64(_blake3.blake3.call(void 0, eventJSON));
    const signedEventHash = this.sign({ data: hashedEvent, detached: true });
    rotationEvent.version = version;
    rotationEvent.selfAddressingIdentifier = signedEventHash;
    _chunkSIAYTN4Tcjs.__privateGet.call(void 0, this, _keyEventLog).push(rotationEvent);
  }
  destroy(args) {
    const { backers = [] } = args || {};
    if (!_chunkSIAYTN4Tcjs.__privateGet.call(void 0, this, _identifier) || !_optionalChain([_chunkSIAYTN4Tcjs.__privateGet.call(void 0, this, _keyEventLog), 'optionalAccess', _3 => _3.length])) {
      throw Error("Identity does not exist");
    }
    const oldKeyEvent = _chunkSIAYTN4Tcjs.__privateGet.call(void 0, this, _keyEventLog)[_chunkSIAYTN4Tcjs.__privateGet.call(void 0, this, _keyEventLog).length - 1];
    const publicSigningKey = _chunkSIAYTN4Tcjs.__privateGet.call(void 0, this, _keyPairs).signing.publicKey;
    const rotationEvent = {
      identifier: _chunkSIAYTN4Tcjs.__privateGet.call(void 0, this, _identifier),
      eventIndex: (parseInt(oldKeyEvent.eventIndex) + 1).toString(),
      eventType: "destruction",
      signingThreshold: oldKeyEvent.signingThreshold,
      signingKeys: [publicSigningKey],
      nextKeyCommitments: [],
      backerThreshold: oldKeyEvent.backerThreshold,
      backers: [...backers]
    };
    const eventJSON = JSON.stringify(rotationEvent);
    const version = "KERI10JSON" + eventJSON.length.toString(16).padStart(6, "0") + "_";
    const hashedEvent = _tweetnaclutil2.default.encodeBase64(_blake3.blake3.call(void 0, eventJSON));
    const signedEventHash = this.sign({ data: hashedEvent, detached: true });
    rotationEvent.version = version;
    rotationEvent.selfAddressingIdentifier = signedEventHash;
    _chunkSIAYTN4Tcjs.__privateGet.call(void 0, this, _keyEventLog).push(rotationEvent);
  }
  encrypt({ data, publicKey, sharedKey }) {
    if (!_chunkSIAYTN4Tcjs.__privateGet.call(void 0, this, _keyPairs)) {
      throw new Error("No key pairs found, please import or incept identity");
    }
    const utfData = typeof data === "string" ? data : JSON.stringify(data);
    const uintData = _tweetnaclutil2.default.decodeUTF8(utfData);
    const nonce = _tweetnacl2.default.randomBytes(_tweetnacl2.default.box.nonceLength);
    let box;
    if (publicKey) {
      const publicKeyUint = _tweetnaclutil2.default.decodeBase64(publicKey);
      box = _tweetnacl2.default.box(uintData, nonce, publicKeyUint, _tweetnaclutil2.default.decodeBase64(_chunkSIAYTN4Tcjs.__privateGet.call(void 0, this, _keyPairs).encryption.secretKey));
    } else if (sharedKey) {
      const sharedKeyUint = _tweetnaclutil2.default.decodeBase64(sharedKey);
      box = _tweetnacl2.default.box.after(uintData, nonce, sharedKeyUint);
    } else {
      const secreKeyUint = _tweetnaclutil2.default.decodeBase64(_chunkSIAYTN4Tcjs.__privateGet.call(void 0, this, _keyPairs).encryption.secretKey);
      box = _tweetnacl2.default.secretbox(uintData, nonce, secreKeyUint);
    }
    const encrypted = new Uint8Array(nonce.length + box.length);
    encrypted.set(nonce);
    encrypted.set(box, nonce.length);
    return _tweetnaclutil2.default.encodeBase64(encrypted);
  }
  decrypt({ data, publicKey, sharedKey }) {
    if (!_chunkSIAYTN4Tcjs.__privateGet.call(void 0, this, _keyPairs)) {
      throw new Error("No key pairs found, please import or incept identity");
    }
    const uintDataAndNonce = _tweetnaclutil2.default.decodeBase64(data);
    const nonce = uintDataAndNonce.slice(0, _tweetnacl2.default.secretbox.nonceLength);
    const uintData = uintDataAndNonce.slice(_tweetnacl2.default.secretbox.nonceLength, uintDataAndNonce.length);
    let decrypted;
    if (publicKey) {
      const publicKeyUint = _tweetnaclutil2.default.decodeBase64(publicKey);
      decrypted = _tweetnacl2.default.box.open(uintData, nonce, publicKeyUint, _tweetnaclutil2.default.decodeBase64(_chunkSIAYTN4Tcjs.__privateGet.call(void 0, this, _keyPairs).encryption.secretKey));
    } else if (sharedKey) {
      const sharedKeyUint = _tweetnaclutil2.default.decodeBase64(sharedKey);
      decrypted = _tweetnacl2.default.box.open.after(uintData, nonce, sharedKeyUint);
    } else {
      const secreKeyUint = _tweetnaclutil2.default.decodeBase64(_chunkSIAYTN4Tcjs.__privateGet.call(void 0, this, _keyPairs).encryption.secretKey);
      decrypted = _tweetnacl2.default.secretbox.open(uintData, nonce, secreKeyUint);
    }
    if (!decrypted) {
      throw new Error("Could not decrypt message");
    }
    const utf8Result = _tweetnaclutil2.default.encodeUTF8(decrypted);
    const result = this.__parseJSON(utf8Result) || utf8Result;
    return result;
  }
  sign({ data, detached = false }) {
    if (typeof data !== "string") {
      data = this.__parseJSON(data);
    }
    const uintData = _tweetnaclutil2.default.decodeUTF8(data);
    const uintSecretKey = _tweetnaclutil2.default.decodeBase64(_chunkSIAYTN4Tcjs.__privateGet.call(void 0, this, _keyPairs).signing.secretKey);
    const signature = detached ? _tweetnaclutil2.default.encodeBase64(_tweetnacl2.default.sign.detached(uintData, uintSecretKey)) : _tweetnaclutil2.default.encodeBase64(_tweetnacl2.default.sign(uintData, uintSecretKey));
    return signature;
  }
  verify({ publicKey, signature, data }) {
    if (!!data) {
      if (typeof data !== "string") {
        data = _tweetnaclutil2.default.decodeUTF8(this.__parseJSON(data));
      }
      data = _tweetnaclutil2.default.decodeUTF8(data);
    }
    const uintSignature = _tweetnaclutil2.default.decodeBase64(signature);
    const uintPublicKey = _tweetnaclutil2.default.decodeBase64(publicKey);
    if (data) {
      return _tweetnacl2.default.sign.detached.verify(data, uintSignature, uintPublicKey);
    } else {
      const uintResult = _tweetnacl2.default.sign.open(uintSignature, uintPublicKey);
      if (uintResult === null)
        return uintResult;
      const utf8Result = _tweetnaclutil2.default.encodeUTF8(uintResult);
      return this.__parseJSON(utf8Result) || utf8Result;
    }
  }
  addConnection(Connection) {
    return new Connection({
      keyPairs: _chunkSIAYTN4Tcjs.__privateGet.call(void 0, this, _keyPairs),
      encrypt: this.encrypt.bind(this),
      decrypt: this.decrypt.bind(this),
      sign: this.sign.bind(this),
      verify: this.verify.bind(this)
    });
  }
  toJSON() {
    return {
      identifier: _chunkSIAYTN4Tcjs.__privateGet.call(void 0, this, _identifier),
      keyEventLog: _chunkSIAYTN4Tcjs.__privateGet.call(void 0, this, _keyEventLog)
    };
  }
}
_keyPairs = new WeakMap();
_identifier = new WeakMap();
_keyEventLog = new WeakMap();
_connections = new WeakMap();


exports.Identity = Identity;
