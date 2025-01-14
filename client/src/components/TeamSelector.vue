<script setup lang='ts'>
import { store } from '@/lib/store';
const props = defineProps<{
	xPlayers: number;
	oPlayers: number;
}>();
function pickTeam(team: 'x' | 'o') {
	store.team = team;
}
</script>
<template>
	<div class="team-selector">
		<div class="title">Select your team</div>
		<div class="buttons">
			<div class="button" data-team="x" @click='pickTeam("x")'>
				<div class="name">X</div>
				<div class="player-count">{{ xPlayers }} players</div>
			</div>
			<div class="or">OR</div>
			<div class="button" data-team="o" @click='pickTeam("o")'>
				<div class="name">O</div>
				<div class="player-count">{{ oPlayers }} players</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
.team-selector {
	position: fixed;
	width: 100%;
	height: 100%;
	z-index: 1000;
	top: 0;
	left: 0;
	display: flex;
	flex-direction: column;
}

.title {
	z-index: 1000;
	text-align: center;
	background: white;
	padding: 10px 0;
	font: bold 14pt Helvetica;
	text-transform: uppercase;
}

.buttons {
	position: relative;
	display: flex;
	flex-direction: column;
	flex: 1;
}

.button {
	width: 100%;
	height: 50%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	cursor: pointer;
	color: white;

	& .name {
		font: bold 42pt Helvetica;
	}

	& .player-count {
		font: 14pt Helvetica;
	}

	&[data-team='x'] {
		background: var(--team-x-color);

		&:hover {
			background: var(--team-x-color-dark);
		}
	}

	&[data-team='o'] {
		background: var(--team-o-color);

		&:hover {
			background: var(--team-o-color-dark);
		}
	}
}

.or {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	width: 35px;
	height: 35px;
	font: bold 12pt Helvetica;
	border-radius: 50%;
	background-color: white;
	display: flex;
	justify-content: center;
	align-items: center;

	&::before {
		content: '';
		z-index: -1;
		position: absolute;
		width: 100vw;
		height: 10px;
		background: white;
	}
}

@media screen and (min-width: 1024px) {
	.buttons {
		flex-direction: row;
	}

	.button {
		width: 50%;
		height: 100%;
	}

	.or {
		&::before {
			content: '';
			z-index: -1;
			position: absolute;
			width: 10px;
			height: 100vh;
			background: white;
		}
	}
}
</style>
