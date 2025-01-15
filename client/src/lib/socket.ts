import { io } from 'socket.io-client';
import { store } from './store';
import { deepUpdate } from '../../../shared/lib';

const URL = 'http://localhost:3000'; // Replace with your server URL
const socket = io(URL);
socket.on('connect', () => {
	console.log('[Socket] Connected to server');
});

socket.on('disconnect', () => {
	console.log('[Socket] Disconnected from server');
});

socket.on('gameUpdate', (data) => {
	console.log('[Socket] Received update')
	deepUpdate(store.game, data);
});

export default socket;
