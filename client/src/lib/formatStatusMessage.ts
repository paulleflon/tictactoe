import type Status from '@/shared/types/Status';
import coloredTeam from './coloredTeam';

const SENTENCES = {
	win: 'Team $ won! Starting next round...',
	tie: "It's a tie! Starting next round...",
	vote: 'Team $ is voting...',
};
export default function formatStatusMessage(status: Status): string {
	return SENTENCES[status.type].replace('$', coloredTeam(status.actor));
}
