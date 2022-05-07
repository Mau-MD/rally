<script>
	import '../app.css';
	import { SvelteToast } from '@zerodevx/svelte-toast';
	import { team } from '$lib/store';
</script>

<div
	class="w-[100vw] min-h-[100vh] flex justify-center eitems-center flex-col bg-slate-900 text-white"
>
	{#if $team && $team.solved >= 0 && $team.timeStarted}
		<div>clokc</div>
	{/if}
	<div class="w-[90%] mx-auto">
		<slot />
	</div>
</div>
<SvelteToast />
