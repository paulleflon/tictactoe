<script setup lang='ts'>
import {coloredTeam, gameOutcome}from '@/lib/utils';
import socket from '@/lib/socket';
import { store } from '@/lib/store';
import type { Grid, GridVoteCounts } from '@/shared/types/Grid';
import type Status from '@/shared/types/Status';
import { computed, ref, Transition, watch } from 'vue';
import WinningIndicator from './WinningIndicator.vue';
const props = defineProps<{
	cells: Grid,
	votes: GridVoteCounts,
	status: Status
}>();

const vote = (cell: number) => {
	if (props.status.type === 'vote' && props.status.actor === store.team && props.cells[cell] === null) {
		socket.emit('vote', cell);
	}
};

</script>

<template>
	<div class='grid'>
		<WinningIndicator v-if='props.status.type === "win"' v-for='config of gameOutcome(props.cells)' :key='config'
			:configuration='config' :actor='props.status.actor' />
		<table>
			<tbody>
				<tr v-for='i in 3'>
					<td v-for='j in 3' @click='vote(3 * (i - 1) + j - 1)'>
						<Transition name='new-cell'>
							<div v-if='props.cells[3 * (i - 1) + j - 1] !== null'
								v-html='coloredTeam(props.cells[3 * (i - 1) + j - 1])'>
							</div>
						</Transition>
						<Transition name='vote-cell'>
							<div class='voting-cell'
								v-if='status.type === "vote" && props.votes[3 * (i - 1) + j - 1] > 0'>
								<span>
									{{ props.status.actor }}
								</span>
								<div class='vote-count'>
									{{ props.votes[3 * (i - 1) + j - 1] }}
								</div>
							</div>
						</Transition>
					</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>

<style scoped>
.new-cell-enter-active {
	transition: transform 0.5s cubic-bezier(0.68, -0.55, 0.27, 2.55);
}

.new-cell-leave-active {
	transition: transform .8s ease;
}

.new-cell-enter-from,
.new-cell-leave-to {
	transform: scale(0);
}

.vote-cell-enter-active,
.vote-cell-leave-active {
	transition: all .15s ease;
}

.vote-cell-enter-from,
.vote-cell-leave-to {
	opacity: 0;
	filter: blur(10px);
}

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
	cursor: pointer;
	vertical-align: middle;
	text-align: center;
	font: bold 24pt Helvetica;
	text-transform: uppercase;

	&:hover {
		background-color: #f0f0f0;
	}
}

.voting-cell {
	position: absolute;
	top: 0;
	left: 0;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	width: 100%;
	height: 100%;
}

.vote-count {
	position: absolute;
	bottom: 0;
	right: 0;
	padding: 2px 5px;
	font: 12pt Helvetica;
}
</style>
