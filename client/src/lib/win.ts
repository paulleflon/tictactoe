import type { Grid } from '@/shared/types/Grid';

type WinningConfiguration =
	| 'top'
	| 'middle'
	| 'bottom'
	| 'left'
	| 'center'
	| 'right'
	| 'top-left'
	| 'top-right';
export type { WinningConfiguration };

export function winningConfiguration(grid: Grid): WinningConfiguration[] {
	const winningConfigurations = [
		// horizontal
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		// vertical
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		// diagonal
		[0, 4, 8],
		[2, 4, 6],
	];
	const configNames: WinningConfiguration[] = [
		'top',
		'middle',
		'bottom',
		'left',
		'center',
		'right',
		'top-left',
		'top-right',
	];
	const winningConfigs: WinningConfiguration[] = [];
	for (const configuration of winningConfigurations) {
		const [a, b, c] = configuration;
		if (grid[a] && grid[a] === grid[b] && grid[a] === grid[c]) {
			winningConfigs.push(configNames[winningConfigurations.indexOf(configuration)]);
		}
	}
	return winningConfigs;
}
