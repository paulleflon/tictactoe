import type { CellValue } from '@/shared/types/Grid';

export default function coloredTeam(team: CellValue): string {
	if (team === null) return '';
	return `<span class='colored-${team}'>${team.toUpperCase()}</span>`;
}
