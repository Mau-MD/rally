<script lang="ts">
	import { goto } from '$app/navigation';

	import { page } from '$app/stores';

	import Question from '$lib/components/Question.svelte';
	import { toast } from '@zerodevx/svelte-toast';
	import tokens from '$lib/tokens/clueTokens.json';
	import supabase from '$lib/supabase';
	import { onMount } from 'svelte';
	import { team as _team } from '$lib/store';

	export let team: ITeams;
	export let questions: IQuestion[];

	interface ISelected {
		[key: number]: number;
	}

	let selected: ISelected = {};

	onMount(() => {
		if (team.hasSolvedYet) {
			goto(`/pista/${team.teamId}`);
		}
	});

	async function submitAnswers() {
		let incorrectAnswer = false;
		for (const question of questions) {
			if (selected[question.id] === undefined) {
				toast.push('Debes responder todas las preguntas');
				return;
			}

			if (selected[question.id] !== question.correctAnswer) {
				incorrectAnswer = true;
			}
		}

		if (incorrectAnswer) {
			toast.push('Al menos una de las preguntas es incorrecta');
			return;
		}

		if (team.solved + 1 >= 2) {
			// Terminaste
			await supabase
				.from<ITeams>('teams')
				.update({ hasSolvedYet: true, solved: team.solved + 1, timeEnd: new Date() })
				.eq('teamId', team.teamId);

			_team.set({ ...$_team, timeEnd: new Date() });
			goto('/finish');
			return;
		}

		toast.push('Felicidades, terminaste el set de preguntas');

		// Primero tengo que marcar que el set esta terminado
		await supabase
			.from<ITeams>('teams')
			.update({ hasSolvedYet: true, solved: team.solved + 1 })
			.eq('teamId', team.teamId);

		//@ts-ignore
		goto(`/pista/${team.teamId}`);
	}
</script>

{#if !team.hasSolvedYet}
	<div
		on:click={submitAnswers}
		class="fixed bottom-4 bg-green-500 left-4 right-4 px-4 py-3 rounded shadow-lg text-center"
	>
		Subir
	</div>
	<div class="mx-auto mb-[100px] mt-[50px]">
		<h1 class="text-center text-4xl mb-[50px]">Preguntas</h1>
		{#each questions as question, idx (question.id)}
			<Question
				{question}
				question_number={idx}
				on:change={(event) => (selected[question.id] = event.detail.idx)}
			/>
		{/each}
	</div>
{/if}
