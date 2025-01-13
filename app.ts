import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = new Server(server);
app.set('view engine', 'pug');
app.set('views', 'views');
app.use(express.static('public'));

const gameData = {
	x: {
		score: 0,
		playerCount: 0
	},
	o: {
		score: 0,
		playerCount: 0
	},
	lastPlayed: 'x',
	status: 'x_vote',
	statusTimeStamp: new Date(),
	grid: Array(9).fill(null),
	votingGrid: Array(9).fill(0)
};

function checkWin(): 'x' | 'o' | null {
	const grid = gameData.grid;
	const winPatterrns = [
		[0,1,2], [3,4,5], [6,7,8], // Horizontal
		[0,3,6], [1,4,7], [2,5,8], // Vertical
		[0,4,8], [2,4,6] // Diagonal
	]
	for (const [a,b,c] of winPatterrns) {
		if (grid[a] && grid[a] === grid[b] && grid[b] === grid[c])
			return grid[a];
	}
	return null;
}

function checkTie(): boolean {
	return gameData.grid.every(v => v !== null);
}

function getVotingResults() {
	const grid = gameData.votingGrid;
	let indexes = [0];
	let max = 0;
	for (let i = 0; i < 9; i++) {
		const count = grid[i];
		if (count === max)
			indexes.push(i);
		if (count > max) {
			indexes = [i];
			max = count;
		}
	}
	return indexes[Math.floor(Math.random() * indexes.length)];
}


const STEP_DURATION = 10_000;
setInterval(() => {
	if (gameData.status === 'x_vote' || gameData.status === 'o_vote') {
		const votedCell = getVotingResults();
		const value = gameData.status === 'x_vote' ? 'x' : 'o';
		gameData.grid[votedCell] = value;
		gameData.lastPlayed = value;
		io.emit('cellChange', votedCell, gameData.grid[votedCell]);
		gameData.votingGrid = new Array(9).fill(0);
		const winner = checkWin();
		if (winner) {
			gameData[winner].score++;
			gameData.status = winner + '_win';
			gameData.statusTimeStamp = new Date();
			io.emit('statusChange', gameData.status);
			return;
		}
		if (checkTie()) {
			gameData.status = 'tie';
			gameData.statusTimeStamp = new Date();
			io.emit('statusChange', gameData.status);
		}
		gameData.status = gameData.status === 'x_vote' ? 'o_vote' : 'x_vote';
		gameData.statusTimeStamp = new Date();
		io.emit('statusChange', gameData.status);
	} else { // Starting new game from a win
		gameData.grid = new Array(9).fill(null);
		gameData.status = gameData.lastPlayed === 'x' ? 'o_vote' : 'x_vote';
		gameData.statusTimeStamp = new Date();
		io.emit('statusChange', gameData.status);
	}
}, STEP_DURATION);


app.get('/', (req, res) => {
	const xCountString = `${gameData.x.playerCount} player${gameData.x.playerCount > 1 ? 's' : ''}`;
	const oCountString = `${gameData.o.playerCount} player${gameData.o.playerCount > 1 ? 's' : ''}`;
	res.render('index', {xCountString, oCountString, gameData});
});

io.on('connection', (socket) => {
	console.log('[Socket] New connection');
	socket.on('disconnect', () => {
		console.log('[Socket] Disconnected');
	});
	socket.on('vote', (index) => {
		if (gameData.status !== 'x_vote' && gameData.status !== 'o_vote')
			return;
		if (gameData.grid[index] !== null)
			return;
		gameData.votingGrid[index]++;
		io.emit('vote', index, gameData.votingGrid[index]);
	});
});

server.listen(3000, () => {
	console.log('listening on *:3000');
});