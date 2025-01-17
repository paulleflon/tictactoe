import type { CellValue } from './Grid';

export default interface Status {
	type: 'win' | 'tie' | 'vote';
	actor: 'x' | 'o'; 
	timestamp: Date;
}