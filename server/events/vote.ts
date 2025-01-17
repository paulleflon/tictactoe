import Game from 'types/Game';
import SocketEvent from '../types/SocketEvent';

const voteEvent: SocketEvent = {
	name: 'vote',
	run(game: Game, socket, cell: number, team: string) {
		if (game.status.type !== 'vote' || game.status.actor !== team)
			return;
		game.addVote(socket.id, cell);
	}
}
export default voteEvent;