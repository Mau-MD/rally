<script lang="ts">
	import tokens from '$lib/tokens/clueTokens.json';
	import { goto } from '$app/navigation';

	import { page } from '$app/stores';

	import { team } from '$lib/store';
	import supabase from '$lib/supabase';
	import { toast } from '@zerodevx/svelte-toast';
	import { onMount } from 'svelte';
	import { Circle2 } from 'svelte-loading-spinners';

	const contest = parseInt($page.params.contest);

	let name = '';
	let started = false;

	$: {
		if (started && $team.id !== -1) {
			goto(`/pista/${tokens[contest][($team.id % 2) + 1 + $team.solved]}`);
		}
	}

	onMount(async () => {
		const contestSubscription = supabase
			.from<IContest>('contest')
			.on('UPDATE', async (payload) => {
				if (payload.new.contest === contest) {
					started = payload.new.started;
					team.set({ ...$team, solved: 0, timeStarted: new Date() });
				}
			})
			.subscribe();

		const res = await supabase.from<IContest>('contest').select('started').eq('contest', contest);

		if (!res || !res.data) return;

		started = res.data[0].started;

		return () => contestSubscription.unsubscribe();
	});

	async function submitForm() {
		if (!name) {
			toast.push('El nombre del equipo no puede estar vacio');
			return;
		}

		const res = await supabase.from<ITeams>('teams').insert([{ name, contest }]);

		if (!res || !res.data) {
			toast.push('Hubo un error al crear el equipo. Vuelve a intentarlo');
			return;
		}

		team.set({ id: res.data[0].id, name: res.data[0].name, solved: -1, timeStarted: new Date() });
	}
</script>

{#if $team.id === -1}
	<form on:submit|preventDefault={submitForm} class="flex flex-col gap-6">
		<h1 class="text-xl text-center font-bold">Nombre del equipo</h1>
		<input bind:value={name} class="border-2 py-2 px-4 bg-transparent rounded" />
		<button
			type="submit"
			class="bg-blue-500 shadow-lg shadow-blue-500/50 py-2  text-white rounded-md">Subir</button
		>
	</form>
{:else}
	<h1 class="text-xl text-center font-bold">
		{#if !started}
			Esperando a que inicie el rally...
		{:else}
			<div class="flex justify-center">
				<Circle2 colorInner="#ffffff" />
			</div>
		{/if}
	</h1>
	<p class="text-center mt-2"><strong>Equipo:</strong> {$team.name}</p>
{/if}
