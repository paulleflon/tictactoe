import { CellValue, Grid, VotingGrid } from '@/shared/types/Grid';
import { IGame } from '@/shared/types/IGame';
import Status from '@/shared/types/Status';
import TeamData from '@/shared/types/TeamData';
import {deepUpdate} from '@/shared/lib';
import { Server } from 'socket.io';

export default class Game implements IGame{
	status: Status;
	o: TeamData;
	x: TeamData;
	grid: Grid;
	voting: VotingGrid;
	io: Server;
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
		this.voting = new Array(9).fill(0);
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
	addVote(cell: number) {
		this.voting[cell]++;
		this.io.emit('gameUpdate', {voting: this.voting});
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
			const count = this.voting[i];
			if (count === max)
				indexes.push(i);
			if (count > max) {
				indexes = [i];
				max = count;
			}
		}
		if (!preserve) {
			this.voting = this.voting.map(_ => 0) as VotingGrid;
		}
		if (max === 0)
			return null;
		const cell = indexes[Math.floor(Math.random() * indexes.length)];
		this.grid[cell] = this.status.actor;
		this.io.emit('gameUpdate', {
			grid: this.grid,
			voting: this.voting
		});
		return cell;
	}

	toJSON() {
		return {
			status: this.status,
			o: this.o,
			x: this.x,
			grid: this.grid,
			voting: this.voting
		}
	}

}
