<script setup lang='ts'>
import socket from '@/lib/socket';
import { store } from '@/lib/store';
import { gameOutcome } from '@/lib/utils';
import type { Grid, GridVoteCounts } from '@/shared/types/Grid';
import type Status from '@/shared/types/Status';
import Cell from './Cell.vue';
import WinningIndicator from './WinningIndicator.vue';
import { ref, type VNodeRef } from 'vue';
const props = defineProps<{
	cells: Grid,
	votes: GridVoteCounts,
	status: Status
}>();
const vote = (cell: number) => {
	console.log('vote', cell);
	if (props.status.type === 'vote' && props.status.actor === store.team && props.cells[cell] === null) {
		console.log('?');
		socket.emit('vote', cell);
	}
};

const mod = (i: number, m: number): number => {
	return ((i % m) + m) % m;
}
const focusMove = (from: number, direction: string) => {
	console.log('focusMove', from, direction);
	let target;
	let row = Math.floor(from / 3);
	let col = from % 3;
	switch (direction) {
		case 'up':
			target = col + mod(row - 1, 3) * 3;
			break;
		case 'down':
			target = col + mod(row + 1, 3) * 3;
			break;
		case 'left':
			target = row * 3 + mod(col - 1, 3);
			break;
		case 'right':
			target = row * 3 + mod(col + 1, 3);
			break;
	}
	const targetElm = document.querySelector(`.cell[data-index='${target}']`);
	if (targetElm) {
		(targetElm as HTMLElement).focus();
	}
}

</script>

<template>
	<div class='grid'>
		<WinningIndicator v-if='props.status.type === "win"' v-for='config of gameOutcome(props.cells)' :key='config'
			:configuration='config' :actor='props.status.actor' />
		<table>
			<tbody>
				<tr v-for='i in 3'>
					<td v-for='j in 3'>
						<Cell :value='props.cells[3 * (i - 1) + j - 1]' :voteCount='props.votes[3 * (i - 1) + j - 1]'
							:voteActor='props.status.type === "vote" ? props.status.actor : null'
							:index='3 * (i - 1) + j - 1' @vote='vote(3 * (i - 1) + j - 1)'
							@focusMove='focusMove(3 * (i - 1) + j - 1, $event)' />
					</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>

<style scoped>
.grid {
	position: relative;
	width: 400px;
	height: 400px;
	max-width: 90vw;
	max-height: 90vw;
	margin: 0 auto;
}


table {
	position: relative;
	border: 1px solid black;
	border-collapse: collapse;
	width: 100%;
	height: 100%;
}

td {
	position: relative;
	width: 33%;
	height: 33%;
	border: 1px solid black;
}
</style>
