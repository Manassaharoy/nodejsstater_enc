const CryptoJS = require("crypto-js");

// Define the encryption key and IV
const keyString = "thisIsAverySpecialSecretKey00000";
// const IV = "1583288699248111";

// Convert the key and IV to CryptoJS format
// const key = CryptoJS.enc.Utf8.parse(keyString);
// const iv = CryptoJS.enc.Utf8.parse(IV);

function encryptionMiddleware(req, res, next) {

  req.body = {"data":"hello"}

  // const requestBody = JSON.stringify(req.body);
  const requestBody = "test";

  
  const key = CryptoJS.SHA256(keyString);

  // const encrypted = CryptoJS.AES.encrypt(requestBody, key).toString();
  const encrypted = CryptoJS.AES.encrypt(requestBody, key, {
    iv: CryptoJS.enc.Utf8.parse("1583288699248111"),
    padding: CryptoJS.pad.Pkcs7,
    mode: CryptoJS.mode.CBC,
  });

  req.body = encrypted.ciphertext.toString(CryptoJS.enc.Base64);
  console.log("req.body ---", req.body);

  res.send(req.body);
}

// Decryption middleware
const decryptionMiddleware = (req, res, next) => {
  // const encryptedData = req.body.data;
  // const key = CryptoJS.SHA256(keyString);

  // const decrypted = CryptoJS.AES.decrypt(encryptedData, key).toString(
  //   CryptoJS.enc.Utf8
  // );

  // req.body = JSON.parse(decrypted);
  console.log("decrypt");
  next();
};

module.exports = { encryptionMiddleware, decryptionMiddleware };
