<script setup lang='ts'>
import coloredTeam from '@/lib/coloredTeam';
import socket from '@/lib/socket';
import { store } from '@/lib/store';
import { winningConfiguration } from '@/lib/win';
import type { Grid, GridVoteCounts } from '@/shared/types/Grid';
import type Status from '@/shared/types/Status';
import { computed, ref, Transition, watch } from 'vue';
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
		<div v-if='props.status.type === "win"' v-for='config of winningConfiguration(props.cells)' :key='config'
			:class='`win-indicator ${props.status.actor} ${config}`'></div>
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

.win-indicator {
	position: absolute;
	top: 82.5%;
	border-radius: 10em;
	z-index: 1;
	animation-duration: 3333ms;
	animation-timing-function: ease;
	animation-iteration-count: infinite;

	&.x {
		background: var(--team-x-color);
	}

	&.o {
		background: var(--team-o-color);
	}

	&.top,
	&.middle,
	&.bottom {
		animation-name: strike-h;
		height: 12px;
		transform: translateY(-50%);
	}

	&.top {
		top: 16.5%;
	}

	&.middle {
		top: 49.5%;
	}

	&.bottom {
		top: 83%;
	}

	&.left,
	&.center,
	&.right {
		animation-name: strike-v;
		width: 12px;
		transform: translateX(-50%);
	}

	&.left {
		left: 16.5%;
	}

	&.center {
		left: 50%;
	}

	&.right {
		left: 83.5%;
	}

	&.top-left {
		animation-name: strike-tl;
		height: 12px;
		transform-origin: top left;
		transform: rotate(45deg);
	}

	&.top-right {
		animation-name: strike-tr;
		height: 12px;
		transform-origin: top right;
		transform: rotate(-45deg);
	}

}

@keyframes strike-tr {

	0%,
	49% {
		top: calc(1% * 1.414);
		right: calc(2.5% * 1.414);
		bottom: auto;
		left: auto;
	}

	50% {
		width: calc(95% * 1.414);
		bottom: auto;
		left: auto;
		transform-origin: top right;
	}

	50.0001%,
	100% {
		transform-origin: bottom left;
		top: auto;
		right: auto;
		bottom: calc(1% * 1.414);
		left: calc(2.5% * 1.414);
	}
}

@keyframes strike-tl {

	0%,
	49% {
		top: calc(1% * 1.414);
		left: calc(2.5% * 1.414);
		transform-origin: top left;
	}

	50% {
		width: calc(95% * 1.414);
		transform-origin: top left;
	}

	50%,
	100% {
		transform-origin: bottom right;
		top: auto;
		left: auto;
		bottom: calc(1% * 1.414);
		right: calc(2.5% * 1.414);
	}
}

@keyframes strike-h {

	0%,
	49% {
		left: 2.5%;
	}

	50% {
		width: 95%;
	}

	51%,
	100% {
		left: auto;
		right: 2.5%;
	}
}

@keyframes strike-v {

	0%,
	49% {
		top: 2.5%;
	}

	50% {
		height: 95%;
	}

	51%,
	100% {
		top: auto;
		bottom: 2.5%;
	}
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
