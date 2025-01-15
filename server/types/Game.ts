import { deepUpdate } from '@/shared/lib';
import { CellValue, Grid, GridVoteCounts, GridVotes } from '@/shared/types/Grid';
import { IGame } from '@/shared/types/IGame';
import Status from '@/shared/types/Status';
import TeamData from '@/shared/types/TeamData';
import { Server } from 'socket.io';

export default class Game implements IGame{
	status: Status;
	o: TeamData;
	x: TeamData;
	grid: Grid;
	io: Server;
	votes: GridVotes;
	constructor(io: Server) {
		this.io = io;
		this.status = {
			type: 'vote',
			actor: 'x',
			timestamp: new Date()
		};
		this.o = {
			playerCount: 0,
			score: 0
		};
		this.x = {
			playerCount: 0,
			score: 0
		};
		this.grid = new Array(9).fill(null);
		this.votes = {};
	}

	get voteCounts(): GridVoteCounts {
		const arr = new Array(9).fill(0);
		for (const vote of Object.values<number>(this.votes)) {
			arr[vote]++;
		}
		return arr;
	}

	updateStatus(status: Omit<Status, 'timestamp'>) {
		this.status = {
			...status,
			timestamp: new Date()
		};
		this.io.emit('gameUpdate', {status: this.status});
	}

	update(data: Partial<IGame>) {
		deepUpdate(this, data);
		this.io.emit('gameUpdate', data);
	}
	addVote(id: string, cell: number) {
		if (this.grid[cell] !== null)
			return;
		if (this.votes[id] === cell)
			delete this.votes[id];
		else 
			this.votes[id] = cell;
		this.io.emit('gameUpdate', {voteCounts: this.voteCounts});
	}

	applyOutcome(): CellValue | 'tie' {
		const winPatterrns = [
			[0,1,2], [3,4,5], [6,7,8], // Horizontal
			[0,3,6], [1,4,7], [2,5,8], // Vertical
			[0,4,8], [2,4,6] // Diagonal
		];
		let outcome = null;
		for (const [a,b,c] of winPatterrns) {
			if (this.grid[a] && this.grid[a] === this.grid[b] && this.grid[b] === this.grid[c]) {
				outcome = this.grid[a];
				break;
			}
		}
		if (outcome === null && this.grid.every(v => v !== null))
			outcome = 'tie';
		if (outcome) {
			const update = {
				status: {
					type: outcome === 'tie' ? 'tie' : 'win',
					actor: outcome === 'tie' ? null : outcome,
					timestamp: new Date()
				}
			};
			if (outcome !== 'tie') {
				update[outcome] = {
					score: this[outcome].score + 1
				};
			}
			this.update(update as Partial<IGame>);
		}
		return outcome;
	}

	applyVotes(preserve = false): number | null {
		let indexes = [0];
		let max = 0;
		for (let i = 0; i < 9; i++) {
			const count = this.voteCounts[i];
			if (count === max)
				indexes.push(i);
			if (count > max) {
				indexes = [i];
				max = count;
			}
		}
		if (!preserve)
			this.votes = {};
		if (max === 0)
			return null;
		const cell = indexes[Math.floor(Math.random() * indexes.length)];
		this.grid[cell] = this.status.actor;
		this.io.emit('gameUpdate', {
			grid: this.grid,
			voteCounts: this.voteCounts
		});
		return cell;
	}

	toJSON() {
		return {
			status: this.status,
			o: this.o,
			x: this.x,
			grid: this.grid,
			voteCounts: this.voteCounts
		}
	}

}
