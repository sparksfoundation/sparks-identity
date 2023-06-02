import * as scrypt from 'scrypt-pbkdf';
import nacl from 'tweetnacl';
import util from 'tweetnacl-util';
import { KeyPairs } from '.';

export const signingKeysFromRandom = async () => {
  const signing = nacl.sign.keyPair();
  return {
    publicKey: util.encodeBase64(signing.publicKey),
    secretKey: util.encodeBase64(signing.secretKey),
  };
};

export const encryptionKeysFromRandom = async () => {
  const encryption = nacl.box.keyPair();
  return {
    publicKey: util.encodeBase64(encryption.publicKey),
    secretKey: util.encodeBase64(encryption.secretKey),
  };
};

export const keyPairsFromRandom = async (): Promise<KeyPairs> => {
  return {
    signing: await signingKeysFromRandom(),
    encryption: await encryptionKeysFromRandom(),
  };
};

export const signingKeysFromPassword = async ({ password, salt: noise }) => {
  const options = { N: 16384, r: 8, p: 1 };
  const salt = noise || nacl.randomBytes(nacl.secretbox.nonceLength);
  const buffer = await scrypt.scrypt(
    password,
    salt,
    nacl.box.secretKeyLength / 2,
    options,
  );
  const seed = [...new Uint8Array(buffer)]
    .map((x) => x.toString(16).padStart(2, '0'))
    .join('');

  const uint8Seed = util.decodeUTF8(seed);
  const uint8Keypair = nacl.sign.keyPair.fromSeed(uint8Seed);

  return {
    publicKey: util.encodeBase64(uint8Keypair.publicKey),
    secretKey: util.encodeBase64(uint8Keypair.secretKey),
  };
};

export const encryptionKeysFromPassword = async ({ password, salt: noise }) => {
  const options = { N: 16384, r: 8, p: 1 };
  const salt = noise || nacl.randomBytes(nacl.secretbox.nonceLength);
  const buffer = await scrypt.scrypt(
    password,
    salt,
    nacl.box.secretKeyLength / 2,
    options,
  );
  const seed = [...new Uint8Array(buffer)]
    .map((x) => x.toString(16).padStart(2, '0'))
    .join('');

  const uint8Seed = util.decodeUTF8(seed);
  const uint8Keypair = nacl.box.keyPair.fromSecretKey(uint8Seed);

  return {
    publicKey: util.encodeBase64(uint8Keypair.publicKey),
    secretKey: util.encodeBase64(uint8Keypair.secretKey),
  };
};

export const keyPairsFromPassword = async ({ password, salt }) => {
  return {
    signing: await signingKeysFromPassword({ password, salt }),
    encryption: await encryptionKeysFromPassword({ password, salt }),
  };
};

export const randomSalt = (len = 16) => {
  return util.encodeBase64(nacl.randomBytes(len));
};
