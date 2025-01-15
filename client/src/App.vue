<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { IGame } from '../../shared/types/IGame';
import Grid from './components/Grid.vue';
import Scoreboard from './components/Scoreboard.vue';
import TeamSelector from './components/TeamSelector.vue';
import { store } from './lib/store';
import coloredTeam from './lib/coloredTeam';
import socket from './lib/socket';
socket.connect();
const loading = ref(true);

onMounted(() => {
	fetch('http://localhost:3000/api/game')
		.then(res => res.json())
		.then((data: IGame) => {
			store.game = {
				...data,
				status: {
					...data.status,
					timestamp: new Date(data.status.timestamp)
				}
			};
			loading.value = false;
		});
})
</script>

<template>
	<TeamSelector :x-players='store.game ? store.game.x.playerCount : 0'
		:o-players='store.game ? store.game.o.playerCount : 0' v-if='store.team === null'></TeamSelector>
	<div v-if='loading'>Loading...</div>
	<div v-if='!loading && store.game'>
		<h1>Tic Tac Toe World</h1>
		<h2>You are playing with the <span v-html='coloredTeam(store.team)'></span> team</h2>
		<Scoreboard :o='store.game.o' :x='store.game.x' :status='store.game.status'></Scoreboard>
		<Grid :cells='store.game.grid' :votes='store.game.voteCounts' :status='store.game.status'></Grid>
	</div>
</template>

<style scoped>
h1,
h2 {
	text-align: center;
}
</style>
