import { Injectable } from "@nestjs/common";
import { EventSocketGateway } from "../../socket/socket.io";
import { ConversationRepository, FriendRepository, FriendRequestRepository, UserRepository } from "../../repositories";
import { FilterParamDto, MessageCreateDto } from "../../dto";
import { MessageService } from "../message/message.service";
import { NAME_CONVERSATION_ONE_TO_ONE, OWNER_ID_ONE_TO_ONE } from "../../config/constants";

@Injectable({})
export class FriendService {

    constructor(
        private friendRepository: FriendRepository,
        private friendRequestReposiory: FriendRequestRepository,
        private conversationRepository: ConversationRepository,
        private messageService: MessageService,
        private socket: EventSocketGateway,
        private userRepository: UserRepository
    ) {}
    async createFriendRequest(userId: string, friendId: string) {
        const newFriendRequest = await this.friendRequestReposiory.createFriendRequest(userId, friendId);
        const data = await this.friendRequestReposiory.findById(newFriendRequest._id.toString());
        delete data.fromUserId;
        delete data.toUserId;

        this.socket.emitUpdateFriendRequest(friendId, data);

        return newFriendRequest;
    }

    async approveFriend(fromUserId: string, userId: string) {
        const friend_1 =  await this.friendRepository.createFriend(userId, fromUserId);
        await this.emitFriendNew(userId, friend_1._id.toString());
        const friend_2 = await this.friendRepository.createFriend(fromUserId, userId);
        await this.emitFriendNew(fromUserId, friend_2._id.toString());
        const conversation = await this.conversationRepository.createConversation(OWNER_ID_ONE_TO_ONE,{
            conversationName: NAME_CONVERSATION_ONE_TO_ONE,
            arrayUserId: [userId, fromUserId]
        });

        await this.friendRequestReposiory.updateStatus('approve', fromUserId, userId);

        const currentUser = await this.userRepository.findById(userId);
        const fromUser = await this.userRepository.findById(fromUserId);

        const message: MessageCreateDto = {
            conversationId: conversation._id.toString(),
            content: [currentUser.account.username + ' added friend ' + fromUser.account.username],
            type: 'notification',
            fromUserId: userId
        }

        await this.messageService.createMessage(message);

        return true;
    }

    async rejectFriend(fromUserId: string, userId: string) {
        await this.friendRequestReposiory.updateStatus('reject', fromUserId, userId);

        return true;
    }

    async getAllFriendRequest(userId: string, filters: FilterParamDto) {
        const list = await this.friendRequestReposiory.findAll(userId, filters);
        return list;
    }

    async getAllFriend(userId: string, filters: FilterParamDto) {
        const list = await this.friendRepository.findAll(userId, filters);
        return list;
    }

    async removeFriendRequestAfterRequest(fromUserId: string, toUserId: string) {
        await this.friendRequestReposiory.removeFriendRequestAfterRequest(fromUserId, toUserId);
        return true;
    }

    async emitFriendNew(userId: string, friendId: string) {
        const data = await this.friendRepository.findById(friendId);
        this.socket.emitUpdateFriend(userId, data);
    }

    async removeFriend(userId: string, friendId: string) {
        const currentUser = await this.userRepository.findById(userId);
        const fromUser = await this.userRepository.findById(friendId);
        const conversations = await this.conversationRepository.findOneToOneByUserId(userId);
        
        for (let conversation of conversations) {
            console.log(conversation.users.map(item => item.userId.toString()));
            if (conversation.users.map(item => item.userId.toString()).includes(userId) && conversation.users.map(item => item.userId.toString()).includes(friendId)) {
                
                const conversationId = conversation._id;
                const message: MessageCreateDto = {
                    conversationId: conversationId,
                    content: [currentUser.account.username + ' unfriend ' + fromUser.account.username],
                    type: 'notification',
                    fromUserId: userId
                }
        
                await this.messageService.createMessage(message);
            }
        }
        await this.friendRepository.removeFriend(userId, friendId);
        await this.friendRepository.removeFriend(friendId, userId);

        return true;
    }
}