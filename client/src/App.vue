<script setup lang="ts">
import { onMounted } from 'vue';
import type { IGame } from '../../shared/types/IGame';
import ColoredTeam from './components/ColoredTeam.vue';
import Grid from './components/Grid.vue';
import Scoreboard from './components/Scoreboard.vue';
import TeamSelector from './components/TeamSelector.vue';
import { store } from './lib/store';

const buildTime = import.meta.env.VITE_BUILD_TIME;
const commitHash = import.meta.env.VITE_GIT_COMMIT_HASH;
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
	<img src='/logo.png' alt='Tic Tac Toe Grid logo' />
	<h1>Tic Tac Toe VS the World</h1>
	<h2>You are playing with the
		<ColoredTeam :team='store.team' /> team
	</h2>
	<TeamSelector :x-players='store.game ? store.game.x.playerCount : 0'
		:o-players='store.game ? store.game.o.playerCount : 0' v-if='store.team === null'></TeamSelector>
	<div v-if='store.game'>
		<Scoreboard :o='store.game.o' :x='store.game.x' :status='store.game.status'></Scoreboard>
		<Grid :cells='store.game.grid' :votes='store.game.voteCounts' :status='store.game.status'></Grid>
	</div>
	<footer>
		<p>
			Made in 🇫🇷 by <a href='https://paulleflon.fr' target='_blank'>Paul Leflon</a>
		</p>
		<p>See source code & contribute on <a href='https://github.com/paulleflon/tictactoe' target='_blank'>GitHub</a>!
		</p>
		<hr width='50' />
		<p>Built on {{ buildTime }} | Commit <a :href='`https://github.com/paulleflon/tictactoe/commit/${commitHash}`'
				target='_blank'>{{ commitHash }}</a></p>
	</footer>
</template>

<style scoped>
h1,
h2 {
	text-align: center;
}

img {
	width: 100px;
	margin: 0 auto;
}

footer {
	width: 100%;
	text-align: center;
	font: 8pt 'Arial';
	color: var(--text-color);
	opacity: .7;
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
