

async function deriveKey(password,salt){
    const encoder = new TextEncoder().encode(password);
    const key = await window.crypto.subtle.importKey(
        "raw",
        encoder,
        {name:"PBKDF2"},
        false,
        ["deriveKey"],
    );
    const derivedKey = await window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt,
      iterations: 6000,
      hash: "SHA-256",
    },
    key,
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"],
  );
  console.log("derived");
  return derivedKey;
}
 
async function encryptData(data, password) {
  const salt = window.crypto.getRandomValues(new Uint8Array(16)); // 128-bit salt
  const iv = window.crypto.getRandomValues(new Uint8Array(12)); // 12 bytes for AES-GCM
  const key = await deriveKey(password, salt);
  const encodedData = new TextEncoder().encode(data);
 
  const encryptedContent = await window.crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv,
      tagLength: 128, // 128-bit tag length
    },
    key,
    encodedData,
  );
 
  // extract the ciphertext and authentication tag
  const ciphertext = encryptedContent.slice(0, encryptedContent.byteLength - 16);
  const authTag = encryptedContent.slice(encryptedContent.byteLength - 16);
  console.log("encrypted");
  return {
    ciphertext: new Uint8Array(ciphertext),
    iv,
    authTag: new Uint8Array(authTag),
    salt,
    password:password
  };
}
 
async function decryptData(encryptedData, password) {
  const { ciphertext, iv, authTag, salt } = encryptedData;
  const key = await deriveKey(password, salt);
 
  // re-combine the ciphertext and the authentication tag
  const dataWithAuthTag = new Uint8Array(ciphertext.length + authTag.length);
  dataWithAuthTag.set(ciphertext, 0);
  dataWithAuthTag.set(authTag, ciphertext.length);
 
  const decryptedContent = await window.crypto.subtle.decrypt(
    { name: "AES-GCM", iv, tagLength: 128 },
    key,
    dataWithAuthTag,
  );
 
  return new TextDecoder().decode(decryptedContent);
}

 function evaluatePasswordStrength(password) {
        let strength = 0;
        if (password.length >= 8) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;
        return strength;
    }

export {deriveKey, encryptData, decryptData, evaluatePasswordStrength};