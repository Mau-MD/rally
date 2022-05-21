<script lang="ts">
	import { numToBinary } from '$lib/bincrypt';
	import { goto } from '$app/navigation';

	import { page } from '$app/stores';

	import Question from '$lib/components/Question.svelte';
	import { toast } from '@zerodevx/svelte-toast';
	import tokens from '$lib/tokens/clueTokens.json';
	import supabase from '$lib/supabase';
	import { onMount } from 'svelte';
	import { team as _team } from '$lib/store';
	import { MAX_PROBLEMS } from '$lib/util';
	import { browser } from '$app/env';

	export let team: ITeams;
	export let questions: IQuestion[];

	let timeLeft: number = -1;
	let timer: NodeJS.Timer;
	const TIME_PENALTY = 20;

	interface ISelected {
		[key: number]: number | string;
	}

	let selected: ISelected = {};

	onMount(() => {
		if (team.hasSolvedYet) {
			goto(`/pista/${team.teamId}`);
		}

		const lastSubmittedDate = localStorage.getItem(`timeLeft-${team.teamId}`);
		if (!lastSubmittedDate) return;

		const diff = Math.floor((new Date().getTime() - parseInt(lastSubmittedDate)) / 1000);
		timeLeft = Math.max(TIME_PENALTY - diff, -1);
		setTimer();
	});

	async function submitAnswers() {
		let incorrectAnswer = false;
		for (const question of questions) {
			if (selected[question.id] === undefined) {
				toast.push('Debes responder todas las preguntas');
				return;
			}

			if (question.isOpenAnswer) {
				const answer = selected[question.id] as string;
				if (!question.isOpenAnswer.map((s) => s.toLowerCase()).includes(answer.toLowerCase())) {
					incorrectAnswer = true;
				}
			} else {
				if (selected[question.id] !== question.correctAnswer) {
					incorrectAnswer = true;
				}
			}
		}

		if (incorrectAnswer) {
			toast.push('Al menos una de las respuestas es incorrecta');
			timeLeft = TIME_PENALTY;
			localStorage.setItem(`timeLeft-${team.teamId}`, '' + new Date().getTime());
			setTimer();
			return;
		}

		if (team.solved + 1 >= MAX_PROBLEMS) {
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

		goto(`/photo/${team.teamId}SC${numToBinary(team.solved, '@', '$')}`);

		// Primero tengo que marcar que el set esta terminado
		// await supabase
		// 	.from<ITeams>('teams')
		// 	.update({ hasSolvedYet: true, solved: team.solved + 1 })
		// 	.eq('teamId', team.teamId);

		// //@ts-ignore
		// goto(`/pista/${team.teamId}`);
	}

	function setTimer() {
		timer = setInterval(() => {
			timeLeft -= 1;
		}, 1000);
	}

	$: {
		timeLeft < 0 && clearInterval(timer);
	}
</script>

{#if !team.hasSolvedYet}
	{#if browser}
		<div
			on:click={() => timeLeft === -1 && submitAnswers()}
			class={`fixed bottom-4 ${
				timeLeft !== -1 ? 'bg-red-500' : 'bg-green-500'
			} left-4 right-4 px-4 py-3 rounded shadow-lg text-center`}
			disabled={timeLeft !== -1}
		>
			{timeLeft == -1 ? 'Subir' : `Tienes que esperar ${timeLeft} segundos`}
		</div>
	{/if}
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
