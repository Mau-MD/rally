import crypto from 'simple-encryptor';
export const encryptor = crypto.createEncryptor({
	key: import.meta.env.VITE_SECRET_KEY,
	debug: false,
	hmac: false
});
