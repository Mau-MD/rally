<script lang="ts">
	import { goto } from '$app/navigation';
	import { get } from 'svelte/store';
	import supabase from '$lib/supabase';
	import { onMount } from 'svelte';
	import { Circle2 } from 'svelte-loading-spinners';
	import { toast } from '@zerodevx/svelte-toast';

	export let team: ITeams;
	export let response: number;

	let source: HTMLVideoElement | null = null;
	let photoURL = '';
	let uploading = false;
	let backup = false;

	onMount(() => {
		if (response === 403) {
			goto(`/start/${team.contest}`);
		}
		getCamera();
	});

	async function getCamera() {
		const stream = await navigator.mediaDevices.getUserMedia({
			video: true
		});

		if (!source) return;

		source.srcObject = stream;
		source.play();
	}

	function takePhoto() {
		if (!source) return;
		const canvas = document.createElement('canvas');
		canvas.width = source.videoWidth;
		canvas.height = source.videoHeight;

		const ctx = canvas.getContext('2d');
		ctx?.drawImage(source, 0, 0, canvas.width, canvas.height);

		photoURL = canvas.toDataURL('image/jpeg');
	}

	function retakePhoto() {
		photoURL = '';
		getCamera();
	}

	async function urlToFile(url: string, filename: string, mimeType: string) {
		const res = await fetch(url);
		const blob = await res.blob();
		return new File([blob], filename, { type: mimeType });
	}

	async function submitPhoto() {
		uploading = true;
		const name = `${team.solved + 1}`;
		const file = await urlToFile(photoURL, name, 'image/jpeg');

		const { data, error } = await supabase.storage
			.from('selfies')
			.upload(`public/${team.name}/${name}`, file);

		if (error) {
			toast.push('Hubo un error al subir la selfie');
			uploading = false;
			backup = true;
			return;
		}

		nextClue();
	}

	async function nextClue() {
		await supabase
			.from<ITeams>('teams')
			.update({ hasSolvedYet: true, solved: team.solved + 1 })
			.eq('teamId', team.teamId);
		//@ts-ignore
		goto(`/pista/${team.teamId}`);
	}
</script>

<div class="flex items-center flex-col gap-8">
	<p class="text-center">Para poder continuar, debes de subir una selfie de todo el equipo :)</p>
	<!-- svelte-ignore a11y-media-has-caption -->
	{#if !photoURL}
		<video class="bg-black rounded-md" bind:this={source} />
	{:else}
		<img src={photoURL} class="bg-black rounded-md" alt="selfie" />
	{/if}
	<!-- <video class="w-[300px] h-[300px] bg-black" bind:this={source} /> -->
	<div class="w-[100%] flex flex-col gap-4">
		{#if !uploading}
			<button
				class="py-2 px-2 bg-blue-500 w-[100%] rounded-md"
				on:click={photoURL ? retakePhoto : takePhoto}
			>
				{photoURL ? 'Cambiar foto' : 'Tomar foto'}
			</button>
			{#if photoURL}
				<button class="py-2 px-2 bg-green-500 w-[100%] rounded-md" on:click={submitPhoto}
					>Subir Foto</button
				>
			{/if}
		{:else}
			<div class="text-center flex flex-col items-center">
				<Circle2 colorInner="#ffffff" />
				Subiendo foto
			</div>
		{/if}
		{#if backup}
			<div class="text-center">
				Parece que hubo un error para subir la selfie... ¿Quieres saltar este paso?
			</div>
			<button class="py-2 px-2 bg-red-500 w-[100%] rounded-md" on:click={nextClue}
				>Saltar Paso</button
			>
		{/if}
	</div>
</div>
