import type { CellValue } from '@/shared/types/Grid';
import type { IGame } from '@/shared/types/IGame';
import { reactive } from 'vue';
const savedTeam = localStorage.getItem('3t_team') as 'x' | 'o' | null;
export const store = reactive({
	team: savedTeam,
	game: null as IGame | null,
});
