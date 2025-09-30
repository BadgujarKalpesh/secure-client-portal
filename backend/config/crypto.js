const crypto = require('crypto');

let keyPair;
function ensureKeyPair() {
	if (!keyPair) {
		keyPair = crypto.generateKeyPairSync('rsa', {
			modulusLength: 2048,
			publicKeyEncoding: { type: 'spki', format: 'pem' },
			privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
		});
	}
}

function getPublicKey() {
	ensureKeyPair();
	return keyPair.publicKey;
}

function decryptBase64WithPrivateKey(dataB64) {
	ensureKeyPair();
	const buffer = Buffer.from(dataB64, 'base64');
	const decrypted = crypto.privateDecrypt(
		{
			key: keyPair.privateKey,
			padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
			oaepHash: 'sha256',
		},
		buffer
	);
	return decrypted.toString('utf8');
}

module.exports = { getPublicKey, decryptBase64WithPrivateKey };