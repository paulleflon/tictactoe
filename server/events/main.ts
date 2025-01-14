import SocketEvent from '../types/SocketEvent';
import teamPickEvent from './teamPick';
import voteEvent from './vote';

const events: SocketEvent[] = [
	voteEvent,
	teamPickEvent
];

export default events;