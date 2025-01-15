<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { IGame } from '../../shared/types/IGame';
import Grid from './components/Grid.vue';
import Scoreboard from './components/Scoreboard.vue';
import TeamSelector from './components/TeamSelector.vue';
import coloredTeam from './lib/coloredTeam';
import { store } from './lib/store';
onMounted(() => {
	fetch(`${import.meta.env.VITE_SERVER_URL}/api/game`)
		.then(res => res.json())
		.then((data: IGame) => {
			store.game = {
				...data,
				status: {
					...data.status,
					timestamp: new Date(data.status.timestamp)
				}
			};
		});
})
</script>

<template>
	<h1>Tic Tac Toe VS the World</h1>
	<h2>You are playing with the <span v-html='coloredTeam(store.team)'></span> team</h2>
	<TeamSelector :x-players='store.game ? store.game.x.playerCount : 0'
		:o-players='store.game ? store.game.o.playerCount : 0' v-if='store.team === null'></TeamSelector>
	<div v-if='store.game'>
		<Scoreboard :o='store.game.o' :x='store.game.x' :status='store.game.status'></Scoreboard>
		<Grid :cells='store.game.grid' :votes='store.game.voteCounts' :status='store.game.status'></Grid>
	</div>
	<footer>
		<p>
			Made in 🇫🇷 by <a href='https://paulleflon.fr'>Paul Leflon</a>
		</p>
		<p>See source code & contribute on <a href='https://github.com/paulleflon/tictactoe'>GitHub</a>!</p>
	</footer>
</template>

<style scoped>
h1,
h2 {
	text-align: center;
}

footer {
	width: 100%;
	text-align: center;
	font: 8pt 'Arial';
	color: #444;
	flex: 1;
	display: flex;
	flex-direction: column;
	justify-content: end;
	padding: 10px 0;
}

footer p {
	margin: 0;
}

footer a {
	color: inherit;

	&:hover {
		text-decoration: none;
	}
}
</style>
