import { CellValue, Grid, VotingGrid } from '@shared/types/Grid';
import { IGame } from '@shared/types/IGame';
import Status from '@shared/types/Status';
import TeamData from '@shared/types/TeamData';
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
	}

	update(data: Partial<IGame>) {
		function updateObj(obj: any, data: any) {
			for (const key in data) {
				if (typeof data[key] === 'object' && data[key] !== null)
					updateObj(obj[key], data[key]);
				else
					obj[key] = data[key];
			}
		}
		updateObj(this, data);
		this.io.emit('gameUpdate', data);
	}
	addVote(cell: number) {
		this.voting[cell]++;
		this.io.emit('newVote', cell, this.voting[cell]);
	}

	checkOutcome(): CellValue | 'tie' {
		const winPatterrns = [
			[0,1,2], [3,4,5], [6,7,8], // Horizontal
			[0,3,6], [1,4,7], [2,5,8], // Vertical
			[0,4,8], [2,4,6] // Diagonal
		];
		for (const [a,b,c] of winPatterrns) {
			if (this.grid[a] && this.grid[a] === this.grid[b] && this.grid[b] === this.grid[c])
				return this.grid[a];
		}
		if (this.grid.every(v => v !== null))
			return 'tie';
		return null;
	}

	getVotingResults(preserve = false): number | null {
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
		if (!preserve)
			this.voting = this.voting.map(_ => 0) as VotingGrid;
		if (max === 0)
			return null;
		return indexes[Math.floor(Math.random() * indexes.length)];
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
