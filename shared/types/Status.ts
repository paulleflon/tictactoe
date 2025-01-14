import { CellValue } from './Grid';

export default interface Status {
	type: 'win' | 'tie' | 'vote';
	actor: CellValue; 
	timestamp: Date;
}