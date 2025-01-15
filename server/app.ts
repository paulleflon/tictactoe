import cors from 'cors';
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import Game from './types/Game';
import events from './events/main';
import { STEP_DURATION } from '@/shared/constants';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
	cors: {
		origin: '*',
		methods: ['GET', 'POST']
	}
});
const game = new Game(io);

app.use(cors({
	origin: '*',
	methods: ['GET', 'POST']
}));
app.set('view engine', 'pug');
app.set('views', 'views');
app.use(express.static('public'));

game.grid = [
	'x', 'x', 'o',null, null, null, 'o','x','o'
];
game.voting = [
	0,0,0,0,5,10,0,0,1
];

// Game Loop
setInterval(() => {
	if (game.status.type === 'vote') {
		game.applyVotes();
		game.applyOutcome();
		if (game.status.type === 'vote') {
			game.updateStatus({
				type: 'vote',
				actor: game.status.actor === 'x' ? 'o' : 'x'
			});
		}
	} else {
		game.update({
			status: {
				type: 'vote',
				actor: game.status.actor === 'x' ? 'o' : 'x',
				timestamp: new Date()
			},
			grid: Array(9).fill(null),
			voting: Array(9).fill(null)
		})
	}
}, STEP_DURATION);	


app.get('/api/game', (req, res) => {
	res.json(game.toJSON());
});

io.on('connection', (socket) => {
	for (const event of events) {
		socket.on(event.name, (...args) => event.run(game, socket, ...args));
	}
	console.log(`[${socket.id}] New Socket.`);
	socket.on('disconnect', () => {
		console.log(`[${socket.id}] Disconnected.`);
		if (socket.team) {
			game[socket.team].playerCount--;
			game.update({
				[socket.team]: {
					playerCount: game[socket.team].playerCount
				}
			});
		}
	});
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});