<script setup lang='ts'>
import coloredTeam from '@/lib/coloredTeam';
import type { Grid, VotingGrid } from '@/shared/types/Grid';
import type Status from '@/shared/types/Status';

const props = defineProps<{
	cells: Grid,
	votes: VotingGrid,
	status: Status
}>();
</script>

<template>
	<table>
		<tbody>
			<tr v-for='i in 3'>
				<td v-for='j in 3'>
					<div v-if='props.cells[3 * (i - 1) + j - 1] !== null'
						v-html='coloredTeam(props.cells[3 * (i - 1) + j - 1])'>
					</div>
					<div class='voting-cell' v-else-if='status.type === "vote" && props.votes[3 * (i - 1) + j - 1] > 0'>
						<span>
							{{ props.status.actor }}
						</span>
						<div class='vote-count'>
							{{ props.votes[3 * (i - 1) + j - 1] }}
						</div>
					</div>
				</td>
			</tr>
		</tbody>
	</table>
</template>

<style scoped>
table {
	position: relative;
	border: 1px solid black;
	width: 400px;
	height: 400px;
	max-width: 90vw;
	max-height: 90vw;
	border-collapse: collapse;
	margin: 0 auto;
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
.vote-count {
	position: absolute;
	bottom: 0;
	right: 0;
	padding: 2px 5px;
	font: 12pt Helvetica;
}
</style>
