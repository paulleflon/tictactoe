import { Socket } from 'socket.io';
import Game from '../../shared/types/IGame';

export default interface SocketEvent {
	name: string;
	run(game: Game, socket: Socket, ...args: any[]): void;
}