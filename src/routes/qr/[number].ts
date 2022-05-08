import type { RequestHandler } from '@sveltejs/kit';
import { encryptor } from '$lib/crypto';

export const get: RequestHandler = async ({ params }): Promise<{ body: any }> => {
	return {
		body: {
			qrId: encryptor.decrypt<string>(decodeURIComponent(params.number))
		}
	};
};
