<script lang="ts">
	import { goto } from '$app/navigation';

	import { team } from '$lib/store';
	import supabase from '$lib/supabase';
	import { toast } from '@zerodevx/svelte-toast';
	import { onMount } from 'svelte';

	export let qrId: string;

	onMount(async () => {
		const contest = qrId.split('-')[0];
		const id = qrId.split('-')[1];

		const res = await supabase.from<ITeams>('teams').select('*').eq('teamId', $team.teamId);

		console.log('QR', qrId);
		// Checar si el equipo ya ha resuelto el problema
		if (!res || !res.data) return;

		const teamData = res.data[0];

		if (teamData.contest !== parseInt(contest)) {
			toast.push('El qr no corresponde a este rally');
			goto(`/pista/${$team.teamId}`);
			return;
		}

		if (!teamData.hasSolvedYet) {
			toast.push('No has resuelto el problema aun');
			goto(`/set/${$team.teamId}`);
			return;
		}

		// Checar si el qr corresponde al equipo
		// qrId corresponde al set de preguntas siguiente

		// quiero valores 1 y 2

		const currIdx = ((teamData.solved + (teamData.id % 2) + 1) % 2) + 1;
		console.log(currIdx);

		if (currIdx.toString() !== id) {
			toast.push('El qr no corresponde al problema actual');
			goto(`/pista/${$team.teamId}`);
			return;
		}

		await supabase
			.from<ITeams>('teams')
			.update({ hasSolvedYet: false })
			.eq('teamId', teamData.teamId);

		goto(`/set/${$team.teamId}`);
	});
</script>
