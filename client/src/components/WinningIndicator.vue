<script setup lang='ts'>
import { type WinningConfiguration } from '@/lib/utils';
import type { CellValue } from '@/shared/types/Grid';

const props = defineProps<{
	configuration: WinningConfiguration,
	actor: CellValue
}>();
</script>
<template>
	<div class='win-indicator' :class='[props.actor, props.configuration]'></div>
</template>
<style scoped>
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
</style>
