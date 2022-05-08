<script lang="ts">
	import Timer from '$lib/components/Timer.svelte';
	import { team } from '$lib/store';
	import { differenceInSeconds } from 'date-fns';

	let hours = 0,
		seconds = 0,
		minutes = 0;

	$: {
		if ($team.timeEnd) {
			const secondsDiff = differenceInSeconds(new Date($team.timeEnd), new Date($team.timeStarted));
			hours = Math.floor(secondsDiff / 3600);
			seconds = secondsDiff % 3600;
			minutes = Math.floor(seconds / 60);
			seconds = seconds % 60;
		}
	}
</script>

<Timer {seconds} {minutes} {hours} start={false} />
<div class="font-bold text-xl text-center">Felicidades! Acabaste el rally</div>
