import {SubscribeMessage, WebSocketGateway, WebSocketServer} from '@nestjs/websockets';
import {Server, Socket} from 'socket.io';
import { ConversationResponseDto, FriendRequestResponseDto, FriendResponseDto, MessageResponseDto } from '../dto';

@WebSocketGateway()
export class EventSocketGateway {
	@WebSocketServer()
	server: Server;

	constructor() {

	}
	async handleConnection(client: Socket) {
		const room = client.handshake.query.userId;
		console.log("user conent: ", room);
		
		client.join(room);
	}

	public emitMessage(message: MessageResponseDto, listroom: string[]) {
		this.server.in(listroom).emit('new-message', {message});
	}

	@SubscribeMessage('join-room')
	public handleJoinRoom(client: Socket, data: string) {
		const roomUser = client.handshake.query.userId;
		for (let room of client.rooms.values()) {
			if (!room.includes(roomUser.toString()) && !room.includes(data) && !room.includes(client.id)) {
				client.leave(room);
			}
		}
		client.join(data);
		console.log("rooms of user "+roomUser,client.rooms);
		console.log(client.handshake.query.userId + " join " + data);

	}

	@SubscribeMessage('leave-room')
	public handleLeaveRoom(client: Socket, data: string) {
		client.leave(data);
		console.log(client.handshake.query.userId + " leave " + data);
	}

	public emitUpdateConversation(conversationResponse: any,listRoom: string[]) {
		this.server.in(listRoom).emit('update-conversation', {conversation: conversationResponse});
	}

	// public emitSendRequestFriend(userId: string, data: FriendRequestResponseDto) {
	// 	this.server.to(userId).emit('send-friend-request', data);
	// }

	// public emitAddfriend(userId: string, data: FriendResponseDto) {
	// 	this.server.to(userId).emit('approved-friend', data);
	// }

	public emitUpdateFriendRequest(userId: string,data: FriendRequestResponseDto) {
		console.log(userId,'update-friend-request', data);
		
		this.server.to(userId).emit('update-friend-request', data);
	}

	public emitUpdateFriend(userId: string, data: FriendResponseDto) {
		console.log(userId,'update-friend', data);
		
		this.server.to(userId).emit('update-friend', data);
	}
}