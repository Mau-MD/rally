import type { RequestHandler } from '@sveltejs/kit/types/internal';
import { encryptor } from '$lib/crypto';
import supabase from '$lib/supabase';

import fs from 'fs';

export const get: RequestHandler = async ({ params }): Promise<{ body: any }> => {
	const team = await supabase.from<ITeams>('teams').select('*').eq('teamId', params.id);

	if (!team || !team.data) {
		return {
			body: {
				response: 404
			}
		};
	}
	const teamData = team.data[0];
	// const clueIdx = (team.data[0].id % 2) + team.data[0].solved + 1;

	const clueIdx = ((teamData.solved + (teamData.id % 2) + 1) % 2) + 1;

	const clues = await supabase
		.from<IClue>('clues')
		.select('*')
		.eq('set', clueIdx)
		.eq('contest', team.data[0].contest);

	if (!clues || !clues.data) {
		return {
			body: {
				response: 404
			}
		};
	}

	return {
		body: {
			clues: clues.data,
			team: team.data[0]
		}
	};
};
