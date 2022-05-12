<script>
	import '../app.css';
	import { SvelteToast } from '@zerodevx/svelte-toast';
	import { team } from '$lib/store';
	import Timer from '$lib/components/Timer.svelte';
	import { onMount } from 'svelte';
	import { afterNavigate } from '$app/navigation';
	import { differenceInSeconds } from 'date-fns';
	import bg from '$lib/assets/hero.jpg';

	let seconds = 0,
		minutes = 0,
		hours = 0;

	afterNavigate(() => {
		if ($team.id !== -1) {
			const secondsDiff = differenceInSeconds(new Date(), new Date($team.timeStarted));
			hours = Math.floor(secondsDiff / 3600);
			seconds = secondsDiff % 3600;
			minutes = Math.floor(seconds / 60);
			seconds = seconds % 60;
		}
	});
</script>

<div
	class="w-[100vw] min-h-[100vh] flex justify-center eitems-center flex-col bg-slate-900 text-white"
	style="background-image: url('{bg}'); background-size: cover; background-position: right;"
>
	{#if $team && $team.solved >= 0 && $team.timeStarted && !$team.timeEnd}
		<div class="font-bold text-center">
			<Timer {seconds} {minutes} {hours} />
		</div>
	{/if}
	<div class="w-[90%] mx-auto">
		<slot />
	</div>
</div>
<SvelteToast />
