<script lang="ts">
	export let clues: IClue[];
</script>

{#if clues}
	<h1 class="text-xl text-center font-bold mb-4">Pista numero {clues[0].set}</h1>
	<p class="text-center">
		{clues[0].clue}
	</p>
{:else}
	<h1 class="text-xl text-center font-bold mb-4">No hay pistas para este set</h1>
{/if}
