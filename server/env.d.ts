import "socket.io";

interface CustomSocket {
	team: string;
}

declare module "socket.io" {
	interface Socket extends CustomSocket {}
}