<script lang="ts">
	import { goto } from '$app/navigation';

	import { page } from '$app/stores';

	import Question from '$lib/components/Question.svelte';
	import { toast } from '@zerodevx/svelte-toast';
	import tokens from '$lib/tokens/clueTokens.json';
	import { team } from '$lib/store';
import supabase from '$lib/supabase';

	export let questions: IQuestion[];

	interface ISelected {
		[key: number]: number;
	}

	let selected: ISelected = {};

	function submitAnswers() {
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
		toast.push('Felicidades, terminaste el set de preguntas');

		const contest = questions[0].contest;
		const nextSet = questions[0].set + 1;

		await supabase.from<ITeams>('teams').update({solved: })

		//@ts-ignore
		goto(`/pista/${tokens[contest][nextSet]}`);
	}
</script>

<div
	on:click={submitAnswers}
	class="fixed bottom-4 bg-green-500 left-4 right-4 px-4 py-3 rounded shadow-lg text-center"
>
	Subir
</div>
<div class="mx-auto my-[100px]">
	<h1 class="text-center text-4xl mb-[50px]">Preguntas</h1>
	{#each questions as question, idx (question.id)}
		<Question
			{question}
			question_number={idx}
			on:change={(event) => (selected[question.id] = event.detail.idx)}
		/>
	{/each}
</div>
