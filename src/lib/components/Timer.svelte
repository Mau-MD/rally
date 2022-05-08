<script lang="ts">
	import { onMount } from 'svelte';

	export let seconds = 0;
	export let minutes = 0;
	export let hours = 0;

	export let start = true;

	$: {
		if (seconds >= 60) {
			minutes++;
			seconds = 0;

			if (minutes >= 60) {
				hours++;
				minutes = 0;
			}
		}
	}

	onMount(() => {
		if (!start) return;
		const interval = setInterval(() => {
			seconds++;
		}, 1000);

		return () => clearInterval(interval);
	});

	function setLeadingZero(num: number) {
		if (num < 10) {
			return `0${num}`;
		}
		return `${num}`;
	}
</script>

<div class="font-bold text-center text-4xl mt-[50px]">
	{setLeadingZero(hours)}:{setLeadingZero(minutes)}:{setLeadingZero(seconds)}
</div>
