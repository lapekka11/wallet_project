async function deriveKey(password, salt) {
    // Convert password string to ArrayBuffer
    const encoder = new TextEncoder();
    const passwordBuffer = encoder.encode(password);
    
    // Import the password as a raw key material
    const importedKey = await crypto.subtle.importKey(
        "raw",
        passwordBuffer,
        { name: "PBKDF2" },
        false,
        ["deriveKey"]
    );
    
    // Derive the AES-GCM key from the password
    const derivedKey = await crypto.subtle.deriveKey(
        {
            name: "PBKDF2",
            salt: salt,
            iterations: 6000,
            hash: "SHA-256",
        },
        importedKey,
        { name: "AES-GCM", length: 256 },
        true,
        ["encrypt", "decrypt"]
    );
    
    console.log("Key derived successfully");
    return derivedKey;
}


 
async function encryptData(data, password) {
  const salt = crypto.getRandomValues(new Uint8Array(16)); // 128-bit salt
  const iv = crypto.getRandomValues(new Uint8Array(12)); // 12 bytes for AES-GCM
  const key = await deriveKey(password, salt);
  const encodedData = new TextEncoder().encode(data);
 
  const encryptedContent = await crypto.subtle.encrypt(
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
    salt
  };
}
 



async function decryptData(encryptedData, password) {
  try {
    console.log("=== DECRYPTION DEBUG START ===");
    
    const { ciphertext, iv, authTag, salt } = encryptedData;  
    
   
    const key = await deriveKey(password, salt);
    
    // Re-combine the ciphertext and the authentication tag
    const dataWithAuthTag = new Uint8Array(ciphertext.length + authTag.length);
    dataWithAuthTag.set(ciphertext, 0);
    dataWithAuthTag.set(authTag, ciphertext.length);
    
    const decryptedContent = await crypto.subtle.decrypt(
      { 
        name: "AES-GCM", 
        iv: iv,
        tagLength: 128 
      },
      key,
      dataWithAuthTag,
    );
    
   
    return new TextDecoder().decode(decryptedContent);
    
  } catch (err) {
    console.error("=== DECRYPTION FAILED ===");
    console.error("Error details:", {
      name: err.name,
      message: err.message,
      stack: err.stack
    });
    console.error("Failed at step:", err.stack.split('\n')[1]);
    throw err;
  }
}





export {deriveKey, encryptData, decryptData};