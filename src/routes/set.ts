import type { RequestHandler } from '@sveltejs/kit/types/internal';
import { encryptor } from '$lib/crypto';
import supabase from '$lib/supabase';

import fs from 'fs';

export const get: RequestHandler = async ({ params }): Promise<{ body: any }> => {
	const team = await supabase.from<ITeams>('teams').select('*').eq('id', params.id);

	if (!team || !team.data) {
		return {
			body: {
				response: 404
			}
		};
	}

	const setIdx = (team.data[0].id % 2) + team.data[0].solved + 1;

	const questions = await supabase
		.from<IQuestion>('questions')
		.select('*')
		.eq('set', setIdx)
		.eq('contest', team.data[0].contest);

	if (!questions || !questions.data) {
		return {
			body: {
				response: 404
			}
		};
	}

	console.log(questions.data, 'asdouiajhsd');
	return {
		body: {
			questions: questions.data,
			team: team.data[0]
		}
	};
};
