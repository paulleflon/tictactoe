import { io } from 'socket.io-client';
import { store } from './store';

const URL = 'http://localhost:3000'; // Replace with your server URL
const socket = io(URL);
socket.on('connect', () => {
	console.log('Connected to server');
});

socket.on('disconnect', () => {
	console.log('Disconnected from server');
});

function objUpdate(obj: any, data: any) {
	for (const key in data) {
		if (typeof data[key] === 'object' && !Array.isArray(data[key])) {
			objUpdate(obj[key], data[key]);
		} else {
			obj[key] = data[key];
		}
	}
}

socket.on('gameUpdate', (data) => {
	objUpdate(store.game, data);
});

export default socket;
