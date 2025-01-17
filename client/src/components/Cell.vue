<script lang='ts' setup>
import type { CellValue } from '@/shared/types/Grid';
import { coloredTeam } from '@/lib/utils';
import { Transition } from 'vue';

const props = defineProps<{
	value: CellValue,
	voteCount: number,
	voteActor: CellValue
	index: number,
}>();
const emit = defineEmits(['vote', 'focusMove']);
const keyDown = (e: KeyboardEvent) => {
	if (e.key === 'Enter' || e.key === ' ')
		emit('vote');
	else if (e.key.startsWith('Arrow')) {
		const direction = e.key.slice(5).toLowerCase();
		emit('focusMove', direction);
	}

};
</script>
<template>
	<div class='cell' :data-index='index' @click='emit("vote")' @keydown='keyDown' :tabindex='props.index + 1'>
		<Transition name='new-cell'>
			<div v-if='props.value !== null' v-html='coloredTeam(props.value)'></div>
		</Transition>
		<Transition name='vote-cell'>
			<div class='voting-cell' v-if='props.voteActor && props.voteCount > 0'>
				<span>
					{{ props.voteActor }}
				</span>
				<div class='vote-count'>
					{{ props.voteCount }}
				</div>
			</div>
		</Transition>
	</div>
</template>

<style scoped>
.cell {
	position: relative;
	width: 100%;
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	font: bold 24pt Helvetica;
	cursor: pointer;
	text-transform: capitalize;

	&:hover {
		background-color: #f0f0f0;
	}
}

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
