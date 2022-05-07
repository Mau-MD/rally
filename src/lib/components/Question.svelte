<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let question: IQuestion;
	export let question_number: number;

	const dispatch = createEventDispatcher();

	let selectedIdx: number;

	function handleChange(idx: number) {
		if (selectedIdx === idx) {
			selectedIdx = -1;
			return;
		}
		selectedIdx = idx;
		dispatch('change', { idx });
	}
</script>

<div>
	<h2 class="text-xl text-center font-bold mb-4"># {question_number + 1}</h2>
	<p class="text-center mb-4">
		{question.question}
	</p>
	{#each question.answers as answer (answer.id)}
		<div
			on:click={() => handleChange(answer.id)}
			class={`py-4 px-4 border-2 rounded bg-white/5 transition-all mb-4 ${
				selectedIdx === answer.id && 'border-l-8 bg-white/10'
			}`}
		>
			{answer.answer}
		</div>
	{/each}
</div>
