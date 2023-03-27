const CryptoJS = require("crypto-js");
const { coloredLog } = require("../utils/coloredLog");

// Define the encryption key and IV
const keyString = process.env.KEY_STRING || "thisIsAverySpecialSecretKey00000";
const key = CryptoJS.SHA256(keyString);
const IV = process.env.IV || "1583288699248111";

//? Decryption middleware
const decryptionMiddleware = (req, res, next) => {
  coloredLog("Decryption started", 5);

  const encryptedData = req.body.data; // req body data decryption
  // const encryptedData = "ahsLOjZXgs+FLnb0uYnQ5BH30nzcK6Lw+sDgnAl0qnQ="; // dummy data decryption

  const decrypted = CryptoJS.AES.decrypt(encryptedData, key, {
    iv: CryptoJS.enc.Utf8.parse(IV),
    padding: CryptoJS.pad.Pkcs7,
    mode: CryptoJS.mode.CBC,
  });

  req.body = decrypted.toString(CryptoJS.enc.Utf8);
  if (typeof req.body === "string") {
    req.body = JSON.parse(req.body);
    coloredLog(["Decrypted Data is object = ", `${req.body}`], 5);
  } else {
    coloredLog(["Decrypted Data is string = ", `${req.body}`], 5);
  }
  next();
};

//? Encryption middleware
function encryptionMiddleware(req, res, next) {
  coloredLog(["Encryption started for req body", req.body], 1);
  const requestBody = JSON.stringify(req.body);

  const encrypted = CryptoJS.AES.encrypt(requestBody, key, {
    iv: CryptoJS.enc.Utf8.parse(IV),
    padding: CryptoJS.pad.Pkcs7,
    mode: CryptoJS.mode.CBC,
  });

  let encryptedData = encrypted.ciphertext.toString(CryptoJS.enc.Base64);
  coloredLog(["Encrypted Data = ", req.body], 1);

  res.json({
    decryptedData: typeof req.body === "string" ? JSON.parse(req.body) : req.body,
    encryptedData: encryptedData,
  });
}

module.exports = { encryptionMiddleware, decryptionMiddleware };
