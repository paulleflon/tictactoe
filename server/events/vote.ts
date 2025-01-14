import SocketEvent from '../types/SocketEvent';

const voteEvent: SocketEvent = {
	name: 'vote',
	run(game, socket, cell: number) {
		if (game.status.type !== 'vote')
			return;
		game.addVote(cell);
	}
}
export default voteEvent;