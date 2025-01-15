import type { Grid, GridVoteCounts } from './Grid';
import type Status from './Status';
import type TeamData from './TeamData';

export interface IGame {
	status: Status;
	o: TeamData;
	x: TeamData;
	grid: Grid;
	voteCounts: GridVoteCounts;
}
