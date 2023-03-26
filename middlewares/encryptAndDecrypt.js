const CryptoJS = require("crypto-js");

// Define the encryption key and IV
const keyString = "thisIsAverySpecialSecretKey00000";
const IV = "1583288699248111";

// Convert the key and IV to CryptoJS format
const key = CryptoJS.enc.Utf8.parse(keyString);
const iv = CryptoJS.enc.Utf8.parse(IV);

function encryptionMiddleware(req, res, next) {
  console.log("encryption middleware");

  // Get the request body as a string
  const requestBody = JSON.stringify(req.body);

  // Encrypt the request body using AES encryption
  const encrypted = CryptoJS.AES.encrypt(requestBody, key, {
    iv: iv,
    padding: CryptoJS.pad.Pkcs7,
    mode: CryptoJS.mode.CBC,
  });

  // Convert the encrypted data to a Base64-encoded string
  const encryptedBase64 = encrypted.ciphertext.toString(CryptoJS.enc.Base64);

  // Set the encrypted data as the request body
  req.body = encryptedBase64;

  console.log("encryptedData---------", encryptedBase64);

  res.json({data:encryptedBase64});
}

// Decryption middleware
const decryptionMiddleware = (req, res, next) => {
    // Get the encrypted request body from the request
    const encryptedBase64 = req.body.data;
  
    // Convert the encrypted data from a Base64-encoded string to CryptoJS format
    const encryptedData = CryptoJS.enc.Base64.parse(encryptedBase64);

    // Decrypt the request body using AES decryption
    const decrypted = CryptoJS.AES.decrypt({ ciphertext: encryptedData }, key, {
      iv: iv,
      padding: CryptoJS.pad.Pkcs7,
      mode: CryptoJS.mode.CBC
    });
  
    // Convert the decrypted data to a string and parse it as JSON
    const decryptedBody = (decrypted.toString(CryptoJS.enc.Utf8));
    console.log("decryptedBody---------", typeof(decryptedBody), decryptedBody);
    
    // Set the decrypted data as the request body
    req.body = JSON.parse(decryptedBody);
    console.log("req.body---------", req.body);
  
    next();
  };

module.exports = { encryptionMiddleware, decryptionMiddleware };
