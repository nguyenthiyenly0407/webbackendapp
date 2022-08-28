import { Injectable } from "@nestjs/common";
import { ConversationCreateDto, ConversationUpdateDto, FilterParamDto, MessageCreateDto } from "../../dto";
import { ConversationRepository, MessageRepository, UserRepository } from '../../repositories';
import { MessageService } from "../message/message.service";


@Injectable({})
export class ConversationService {

    constructor(private conversationRepository: ConversationRepository, private userRepository: UserRepository, private messageService: MessageService){}

    async createConversation(userId: string,conversation: ConversationCreateDto) {
        const newConversation = await this.conversationRepository.createConversation(userId,conversation);
        await this.messageService.emitUpdateConversation(newConversation._id.toString());
        return {conversationId: newConversation._id};
    }

    async addUserToConversation(arrayUserId: string[], conversationId: string, userId: string) {
        const currentUser = await this.userRepository.findById(userId);
        let arrayUserName = [];
        for(let id of arrayUserId) {
            const user = await this.userRepository.findById(id);
            arrayUserName.push(user.account.username);
        }
        const content = currentUser.account.username + ' added '+ arrayUserName.toString()+' to the group';

        const message: MessageCreateDto = {
            conversationId: conversationId,
            content: [content],
            type: 'notification',
            fromUserId: userId
        }

        await this.messageService.createMessage(message);
        return await this.conversationRepository.addUsersToGroup(arrayUserId, conversationId);
    }
    
    async getConversationId(conversationId: string) {
        return await this.conversationRepository.getConversationById(conversationId);
    }

    async findAllByUser(filters: FilterParamDto, userId: string) {
        return await this.conversationRepository.getAll(filters, userId);
    }

    async updateConversation(conversationId: string, conversation: ConversationUpdateDto, userId: string) {
        const currentUser = await this.userRepository.findById(userId);
        const content = currentUser.account.username + " changed the group's name to " + conversation.conversationName;

        const message: MessageCreateDto = {
            conversationId: conversationId,
            content: [content],
            type: 'notification',
            fromUserId: userId
        }

        await this.messageService.createMessage(message);
        return await this.conversationRepository.updateConversation(conversationId, conversation);
    }

    async updateReadStatus(userId: string, conversationId: string) {
        await this.conversationRepository.updateReadStatus(userId, conversationId);
    }

    async removeUserFromConversation(userId: string, conversationId: string, currentUserId: string) {
        const currentUser = await this.userRepository.findById(currentUserId);
        const userRemove = await this.userRepository.findById(userId);
        const content = currentUser.account.username + ' removed '+ userRemove.account.username+' from the group';

        const message: MessageCreateDto = {
            conversationId: conversationId,
            content: [content],
            type: 'notification',
            fromUserId: currentUserId
        }

        await this.messageService.createMessage(message);
        await this.conversationRepository.removeUserFromConversation(conversationId , userId);
    }

    async changeRoleUser(ownerId: string,conversationId: string, userId: string, role: string) {
        const ownerUser = await this.userRepository.findById(ownerId);
        const memberUser = await this.userRepository.findById(userId);
        const content = ownerUser.account.username + ' has changed '+ memberUser.account.username+' role to ' + role;

        const message: MessageCreateDto = {
            conversationId: conversationId,
            content: [content],
            type: 'notification',
            fromUserId: ownerId
        }

        await this.messageService.createMessage(message);

        await this.conversationRepository.changeRoleForUser(conversationId, userId, role);
    }

    async findRoleConversationByUserId(conversationId: string, userId: string) {
        return await this.conversationRepository.findRoleConversationByUserId(conversationId, userId);
    }

    async removeConversation(id: string) {
        await this.conversationRepository.removeConversation(id);
   }

   async leaveConversation(conversationId: string, userId: string) {

        const ownerUser = await this.userRepository.findById(userId);
        const content = ownerUser.account.username + ' has left the group';

        const message: MessageCreateDto = {
            conversationId: conversationId,
            content: [content],
            type: 'notification',
            fromUserId: userId
        }

        await this.messageService.createMessage(message);
        await this.conversationRepository.leaveConversation(conversationId, userId);
   }

   async ramdomOwnerConversation(conversationId: string) {
    const conversation = await this.conversationRepository.getConversationById(conversationId);
    for (let user of conversation.users) {
        if (user.account.role === 'admin') {
            await this.conversationRepository.changeRoleForUser(conversationId, user._id.toString(), 'owner-admin');
            break;
        }
    }
   }
}