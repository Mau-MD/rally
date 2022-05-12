const { exec } = require('child_process');
const path = require('path');
const process = require('process');
const fs = require('fs');

const args = process.argv.slice(2);

const BASE_URL = args.includes('--production')
	? 'https://rally-anahuac.vercel.app/qr/'
	: 'http://localhost:3000/qr/';

const generateQr = () => {
	const tokens = args.includes('--set')
		? require('./setTokens.json')
		: require('./clueTokens.json');

	Object.keys(tokens).forEach((token) => {
		// @ts-ignore
		Object.keys(tokens[token]).map((pos) => {
			//@ts-ignore
			const url = BASE_URL + tokens[token][pos];
			const dir = path.join(
				__dirname,
				'.',
				args.includes('--production') ? 'production' : 'dev',
				token
			);

			if (!fs.existsSync(dir)) {
				fs.mkdirSync(dir, { recursive: true });
			}

			exec(`qrencode -s 6 -l H -o "${dir}/${pos}.png" "${url}"`, (error, stdout, stderr) => {
				if (error) {
					console.error(`error: ${error.message}`);
					return;
				}

				if (stderr) {
					console.error(`stderr: ${stderr}`);
					return;
				}
			});
		});
	});
};

generateQr();
