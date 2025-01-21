<script lang='ts' setup>
import type { CellValue } from '@/shared/types/Grid';
import { computed } from 'vue';

const props = defineProps<{
	team: CellValue;
}>();
const color = computed(() => {
	if (props.team)
		return { x: 'var(--team-x-color)', o: 'var(--team-o-color)' }[props.team]
	else
		return '';
});
</script>
<template>
	<span :style='{ color: color }'>{{ props.team || '' }}</span>
</template>

<style scoped>
span {
	text-transform: uppercase;
}
</style>
