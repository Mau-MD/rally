import type { RequestHandler } from '@sveltejs/kit/types/internal';
import { encryptor } from '$lib/crypto';
import supabase from '$lib/supabase';

import fs from 'fs';
import { getIdx } from '$lib/util';

export const get: RequestHandler = async ({ params }): Promise<{ body: any }> => {
	const team = await supabase.from<ITeams>('teams').select('*').eq('teamId', params.id);

	console.log('HI');
	if (!team || !team.data) {
		return {
			body: {
				response: 404
			}
		};
	}

	console.log();
	const teamData = team.data[0];

	const setIdx = getIdx(teamData.solved, teamData.id);

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

	console.log(questions.data);
	return {
		body: {
			questions: questions.data,
			team: team.data[0]
		}
	};
};
