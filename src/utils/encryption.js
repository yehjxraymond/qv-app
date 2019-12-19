import eccrypto from "eccrypto";

export const toBuffer = txt => Buffer.from(txt, "hex");
export const toString = buf => buf.toString("hex");

export const randomPrivateKey = () => {
  const key = eccrypto.generatePrivate();
  return toString(key);
};

export const publicKeyFromPrivateKey = privateKeyStr => {
  const privateKey = toBuffer(privateKeyStr);
  return toString(eccrypto.getPublic(privateKey));
};

export const encryptStringWithPublicKey = async (cleartext, publicKeyStr) => {
  const publicKey = toBuffer(publicKeyStr);
  const res = await eccrypto.encrypt(publicKey, Buffer.from(cleartext));
  const { iv, ciphertext, mac, ephemPublicKey } = res;
  return {
    iv: toString(iv),
    ciphertext: toString(ciphertext),
    mac: toString(mac),
    ephemPublicKey: toString(ephemPublicKey)
  };
};

export const decryptStringWithPrivateKey = async (cipher, privateKeyStr) => {
  const privateKey = toBuffer(privateKeyStr);
  const { iv, ciphertext, mac, ephemPublicKey } = cipher;
  const encrypted = {
    iv: toBuffer(iv),
    ephemPublicKey: toBuffer(ephemPublicKey),
    ciphertext: toBuffer(ciphertext),
    mac: toBuffer(mac)
  };
  const cleartext = await eccrypto.decrypt(privateKey, encrypted);
  return cleartext.toString();
};
