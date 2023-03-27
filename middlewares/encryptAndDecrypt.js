const CryptoJS = require("crypto-js");
const { coloredLog } = require("../utils/coloredLog");

// Define the encryption key and IV
const keyString = process.env.KEY_STRING || "thisIsAverySpecialSecretKey00000";
const IV = process.env.IV || "1583288699248111";

// Convert the key and IV to CryptoJS format
const key = CryptoJS.enc.Utf8.parse(keyString);
const iv = CryptoJS.enc.Utf8.parse(IV);

const ENCRYPTION_STATUS = process.env.ENCRYPTION_STATUS || "TRUE";

//? Decryption middleware
const decryptionMiddleware = (req, res, next) => {
  if (ENCRYPTION_STATUS === "TRUE") {
    coloredLog(["Decryption started"], 5);
    // Get the encrypted request body from the request
    const encryptedBase64 = req.body.data;

    // Convert the encrypted data from a Base64-encoded string to CryptoJS format
    const encryptedData = CryptoJS.enc.Base64.parse(encryptedBase64);

    // Decrypt the request body using AES decryption
    const decrypted = CryptoJS.AES.decrypt({ ciphertext: encryptedData }, key, {
      iv: iv,
      padding: CryptoJS.pad.Pkcs7,
      mode: CryptoJS.mode.CBC,
    });

    // Convert the decrypted data to a string and parse it as JSON
    const decryptedBody = decrypted.toString(CryptoJS.enc.Utf8);

    if (typeof req.body === "string") {
      req.body = JSON.parse(req.body);
      coloredLog(["Decrypted Data is object = ", `${req.body}`], 5);
    } else {
      req.body = decryptedBody;
      coloredLog(["Decrypted Data is string = ", `${decryptedBody}`], 5);
    }
    next();
  } else {
    next();
  }
};

//? Encryption middleware
function encryptionMiddleware(req, res, next) {
  if (ENCRYPTION_STATUS === "TRUE") {
    coloredLog(
      ["Encryption started", "type of", typeof req.body, `${req.body}`],
      1
    );
    // Get the request body as a string
    let requestBody = req.body;

    // let requestBody;
    // if (typeof req.body === "string") requestBody = JSON.parse(req.body);
    // else requestBody = req.body;

    // Encrypt the request body using AES encryption
    const encrypted = CryptoJS.AES.encrypt(requestBody, key, {
      iv: iv,
      padding: CryptoJS.pad.Pkcs7,
      mode: CryptoJS.mode.CBC,
    });

    // Convert the encrypted data to a Base64-encoded string
    const encryptedBase64 = encrypted.ciphertext.toString(CryptoJS.enc.Base64);

    // Set the encrypted data as the request body
    let encryptedData = encryptedBase64;

    coloredLog(["encrypted data: ", encryptedData], 1);

    // if (typeof encryptedData === "string") {
    //   encryptedData = JSON.parse(encryptedData);
    // }

    res.json({
      decryptedData: requestBody,
      encryptedData: encryptedData,
    });
  } else {
    res.json({
      data: req.body.data,
    });
  }
}

module.exports = { encryptionMiddleware, decryptionMiddleware };
