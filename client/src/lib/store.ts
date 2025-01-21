import type { CellValue } from '@/shared/types/Grid';
import type { IGame } from '@/shared/types/IGame';
import { reactive } from 'vue';
let savedTeam = localStorage.getItem('3t_team') as 'x' | 'o' | null;
if (savedTeam !== 'x' && savedTeam !== 'o') {
	savedTeam = null;
	localStorage.removeItem('3t_team');
}

export const store = reactive({
	team: savedTeam,
	game: null as IGame | null,
});
