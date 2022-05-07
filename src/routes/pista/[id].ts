import type { RequestHandler } from '@sveltejs/kit/types/internal';
import { encryptor } from '$lib/crypto';
import supabase from '$lib/supabase';

import fs from 'fs';

export const get: RequestHandler = async ({ params }): Promise<{ body: any }> => {
	const data = encryptor.decrypt<string>(decodeURIComponent(params.id));

	if (!data) return { body: { error: 'Invalid ID' } };

	const contest = parseInt(data.split('-')[0]);
	const set = parseInt(data.split('-')[1]);

	console.log(contest, set);
	const clues = await supabase
		.from<IClue>('clues')
		.select('*')
		.eq('set', set)
		.eq('contest', contest);

	if (!clues || !clues.data) {
		return {
			body: {
				response: 404
			}
		};
	}

	return {
		body: {
			clues: clues.data
		}
	};
};
