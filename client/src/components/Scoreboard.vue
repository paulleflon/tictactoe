<script setup lang='ts'>
import coloredTeam from '@/lib/coloredTeam';
import formatStatusMessage from '@/lib/formatStatusMessage';
import type Status from '@/shared/types/Status';
import type TeamData from '@/shared/types/TeamData';
import { computed, onMounted, ref } from 'vue';

const props = defineProps<{
	o: TeamData,
	x: TeamData,
	status: Status
}>();
const innerBarRef = ref<HTMLElement | null>(null);
const statusMessage = computed(() => formatStatusMessage(props.status));
onMounted(() => {
	const val = (10_000 - Date.now() + props.status.timestamp.getTime()) / 10_000 * 100;
	innerBarRef.value!.style.width = `${val}%`;
	setTimeout(() => {
		innerBarRef.value!.style.width = '';
	}, 0);
});
</script>

<template>
	<div class='scoreboard'>
		<div class='status-message' v-html='statusMessage'></div>
		<div class='status-bar'>
			<div class='status-bar-inner' :data-actor='status.actor || "none"' ref='innerBarRef'></div>
		</div>
		<div class='scores'>
			<div class='team' data-team='x'>
				<div class='name' v-html='coloredTeam("x")'></div>
				<div class='score'>{{ x.score }}</div>
				<div class='player-count'>{{ x.playerCount }} players</div>
			</div>
			<div class='team' data-team='o'>
				<div class='name' v-html='coloredTeam("o")'></div>
				<div class='score'>{{ o.score }}</div>
				<div class='player-count'>{{ o.playerCount }} players</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
.scoreboard {
	border: 1px solid black;
	border-radius: 10px;
	margin: 20px auto;
	text-align: center;
	width: 500px;
	max-width: 90vw;
}

.status-message {
	font: bold 14pt Helvetica;
	padding: 5px 0;
}

.status-bar {
	width: 100%;
	height: 5px;
	margin-bottom: 5px;
	background-color: #eee;
}

@keyframes progress {
	to {
		width: 0;
	}
}

.status-bar-inner {
	width: 100%;
	height: 100%;
	&[data-actor='x'] {
		background-color: #f00;
	}

	&[data-actor='o'] {
		background-color: #00f;
	}

	&[data-actor='none'] {
		background-color: #888;
	}
}

.scores {
	position: relative;
	display: flex;
	justify-content: space-around;
	margin: 20px auto;

	&::after {
		content: '';
		position: absolute;
		width: 1px;
		height: 100%;
		background: #aaa;
	}
}

.team {
	display: flex;
	flex-direction: column;
	align-items: center;

	& .name {
		font: bold 14pt Helvetica;
	}

	& .score {
		font: bold 24pt Helvetica;
	}

	& .player-count {
		font-size: 10pt;
	}
}
</style>
