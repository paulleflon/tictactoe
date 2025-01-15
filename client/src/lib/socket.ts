import { io } from 'socket.io-client';
import { store } from './store';
import { deepUpdate } from '../../../shared/lib';

const URL = 'http://localhost:3000'; // Replace with your server URL
const socket = io(URL);
socket.on('connect', () => {
	console.log('Connected to server');
});

socket.on('disconnect', () => {
	console.log('Disconnected from server');
});

socket.on('gameUpdate', (data) => {
	console.log(data);
	deepUpdate(store.game, data);
});

export default socket;
