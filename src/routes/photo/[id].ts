import { binaryToNum, numToBinary } from '$lib/bincrypt';
import supabase from '$lib/supabase';
import type { RequestHandler } from '@sveltejs/kit';

export const get: RequestHandler = async ({ params }): Promise<{ body: any }> => {
	const [teamId, code] = params.id.split('SC');

	const decrypted = binaryToNum(code, '@', '$');

	const team = await supabase.from<ITeams>('teams').select('*').eq('teamId', teamId);

	if (!team || !team.data) {
		return {
			body: {
				response: 404
			}
		};
	}

	console.log(decrypted, team.data[0].solved);
	if (decrypted !== team.data[0].solved) {
		return {
			body: {
				response: 403,
				team: team.data[0]
			}
		};
	}

	return {
		body: {
			team: team.data[0]
		}
	};
};
