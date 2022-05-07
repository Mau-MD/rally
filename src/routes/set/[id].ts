import type { RequestHandler } from '@sveltejs/kit/types/internal';
import { encryptor } from '$lib/crypto';
import supabase from '$lib/supabase';

import fs from 'fs';

export const get: RequestHandler = async ({ params }): Promise<{ body: any }> => {
	// const a = {};
	// for (let c = 1; c <= 3; c++) {
	// 	a[c] = {};
	// 	for (let i = 1; i <= 9; i++) {
	// 		a[c][i] = encodeURIComponent(encryptor.encrypt(`${c}-${i}`));
	// 	}
	// }
	// fs.writeFileSync('clueTokens.json', JSON.stringify(a, null, 2));

	const data = encryptor.decrypt<string>(decodeURIComponent(params.id));

	if (!data) return { body: { error: 'Invalid ID' } };

	const contest = parseInt(data.split('-')[0]);
	const set = data.split('-')[1];

	console.log(contest, set);
	const questions = await supabase
		.from<IQuestion>('questions')
		.select('*')
		.eq('set', set)
		.eq('contest', contest);

	if (!questions || !questions.data) {
		return {
			body: {
				response: 404
			}
		};
	}

	return {
		body: {
			questions: questions.data
		}
	};
};
