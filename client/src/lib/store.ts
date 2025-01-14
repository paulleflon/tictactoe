import type { IGame } from '@/shared/types/IGame';
import { reactive, watch } from 'vue';
import socket from './socket';

const savedTeam = localStorage.getItem('3t_team') as 'x' | 'o' | null;
if (savedTeam) socket.emit('teamPick', null, savedTeam);
export const store = reactive({
	team: savedTeam,
	game: null as IGame | null,
});

watch(
	() => store.team,
	(newTeam, oldTeam) => {
		if (newTeam === oldTeam || newTeam === null) return;
		localStorage.setItem('3t_team', newTeam || '');
		socket.emit('teamPick', oldTeam, newTeam);
	},
);
