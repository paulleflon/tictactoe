import { io } from 'socket.io-client';
import { store } from './store';
import { deepUpdate } from '../../../shared/lib';
import { watch } from 'vue';

const socket = io(import.meta.env.VITE_SERVER_URL);
socket.on('connect', () => {
	console.log('[Socket] Connected to server');
	if (store.team) {
		socket.emit('teamPick', null, store.team);
	}
});

socket.on('disconnect', () => {
	console.log('[Socket] Disconnected from server');
});

socket.on('gameUpdate', (data) => {
	console.log('[Socket] Received update');
	deepUpdate(store.game, data);
	store.game!.status.timestamp = new Date(store.game!.status.timestamp);
});

watch(
	() => store.team,
	(newTeam, oldTeam) => {
		if (newTeam === oldTeam || newTeam === null) return;
		localStorage.setItem('3t_team', newTeam || '');
		socket.emit('teamPick', oldTeam, newTeam);
	},
);

export default socket;
