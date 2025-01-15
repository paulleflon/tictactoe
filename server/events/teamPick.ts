import SocketEvent from '../types/SocketEvent';

const teamPickEvent: SocketEvent = {
	name: 'teamPick',
	run(game, socket, oldTeam: 'o' | 'x' | null, newTeam: 'o' | 'x') {
			const updates = {};
			if (oldTeam) {
				game[oldTeam].playerCount--;
				updates[oldTeam] = {
					playerCount: game[oldTeam].playerCount
				};
			}
			game[newTeam].playerCount++;
			updates[newTeam] = {
				playerCount: game[newTeam].playerCount
			};
			game.update(updates);
			socket.team = newTeam;
	}
}
export default teamPickEvent;