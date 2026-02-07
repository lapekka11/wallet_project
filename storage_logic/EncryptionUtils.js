
async function deriveKey(password, salt) {
    // Convert password string to ArrayBuffer
    const encoder = new TextEncoder();
    const passwordBuffer = encoder.encode(password);
    
    // Import the password as a raw key material
    const importedKey = await window.crypto.subtle.importKey(
        "raw",
        passwordBuffer,
        { name: "PBKDF2" },
        false,
        ["deriveKey"]
    );
    
    // Derive the AES-GCM key from the password
    const derivedKey = await window.crypto.subtle.deriveKey(
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
    salt
  };
}
 



async function decryptData(encryptedData, password) {
  try {
    console.log("=== DECRYPTION DEBUG START ===");
    
    const { ciphertext, iv, authTag, salt } = encryptedData;
    
    // Log the inputs
    console.log("Inputs received:");
    console.log("- Password length:", password?.length);
    console.log("- Ciphertext type:", ciphertext?.constructor?.name, "length:", ciphertext?.length);
    console.log("- IV type:", iv?.constructor?.name, "length:", iv?.length);
    console.log("- AuthTag type:", authTag?.constructor?.name, "length:", authTag?.length);
    console.log("- Salt type:", salt?.constructor?.name, "length:", salt?.length);
    
    // Log first few bytes of each (for debugging)
    console.log("First 5 bytes of ciphertext:", 
      ciphertext?.slice ? Array.from(ciphertext.slice(0, 5)) : "N/A");
    console.log("First 5 bytes of IV:", 
      iv?.slice ? Array.from(iv.slice(0, 5)) : "N/A");
    console.log("First 5 bytes of authTag:", 
      authTag?.slice ? Array.from(authTag.slice(0, 5)) : "N/A");
    console.log("First 5 bytes of salt:", 
      salt?.slice ? Array.from(salt.slice(0, 5)) : "N/A");
    
    // Derive the key
    console.log("Deriving key...");
    const key = await deriveKey(password, salt);
    console.log("Key derived successfully");
    
    // Re-combine the ciphertext and the authentication tag
    console.log("Combining ciphertext and auth tag...");
    const dataWithAuthTag = new Uint8Array(ciphertext.length + authTag.length);
    dataWithAuthTag.set(ciphertext, 0);
    dataWithAuthTag.set(authTag, ciphertext.length);
    console.log("Combined data length:", dataWithAuthTag.length);
    
    console.log("Attempting decryption...");
    console.log("Decryption parameters:", {
      algorithm: "AES-GCM",
      ivLength: iv.length,
      tagLength: 128,
      keyType: key.algorithm.name,
      keyLength: key.algorithm.length
    });
    
    const decryptedContent = await window.crypto.subtle.decrypt(
      { 
        name: "AES-GCM", 
        iv: iv,
        tagLength: 128 
      },
      key,
      dataWithAuthTag,
    );
    
    console.log("Decryption successful! Decrypted bytes:", decryptedContent.byteLength);
    console.log("=== DECRYPTION DEBUG END ===");
    
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



//async function decryptData(encryptedData, password) {
//  const { ciphertext, iv, authTag, salt } = encryptedData;
//  const key = await deriveKey(password, salt);
// 
//  // re-combine the ciphertext and the authentication tag
//  const dataWithAuthTag = new Uint8Array(ciphertext.length + authTag.length);
//  dataWithAuthTag.set(ciphertext, 0);
//  dataWithAuthTag.set(authTag, ciphertext.length);
//  console.log("decrypting after key derivation");
// 
//  const decryptedContent = await window.crypto.subtle.decrypt(
//    { name: "AES-GCM", iv, tagLength: 128 },
//    key,
//    dataWithAuthTag,
//  );
//  console.log("boutta RETURN");
//  return new TextDecoder().decode(decryptedContent);
//}

 function evaluatePasswordStrength(password) {
        let strength = 0;
        if (password.length >= 8) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;
        return strength;
    }

export {deriveKey, encryptData, decryptData, evaluatePasswordStrength};