<script context="module" lang="ts">
	import supabase from '$lib/supabase';

	import type { Load } from '.svelte-kit/types/src/routes';
	import { toast } from '@zerodevx/svelte-toast';

	export const load: Load = async () => {
		const contests = await supabase.from<IContest>('contest').select('*');

		return {
			props: {
				contests: contests.data
			}
		};
	};
</script>

<script lang="ts">
	export let contests: IContest[];
	let pass = '';

	async function startRally(id: number) {
		// if (confirm('¿Estás seguro de que quieres iniciar la rally?')) {
		if (pass !== import.meta.env.VITE_PASSWORD) {
			toast.push('Contraseña incorrecta');
			return;
		}

		await supabase.from<IContest>('contest').update({ started: true }).eq('contest', id);
		toast.push('Rally Iniciado!');
		//}
	}
</script>

<div class="w-[90%] mx-auto">
	<h1 class="text-xl text-center font-bold mb-[100px]">Iniciar Rally</h1>
	<div class="flex flex-col gap-2">
		<label for="pass">Contraseña</label>
		<input
			bind:value={pass}
			name="pass"
			type="password"
			inputmode="numeric"
			maxlength="4"
			class="bg-transparent border-2 rounded-sm p-2"
		/>
	</div>
	<!-- {JSON.stringify(contests)} -->
	<div class="flex justify-between mt-10">
		{#each contests as contest (contest.id)}
			<div
				class="px-4 py-2 border-2 rounded-md bg-white/10"
				on:click={() => startRally(contest.contest)}
			>
				{contest.contest}
			</div>
		{/each}
	</div>
</div>
