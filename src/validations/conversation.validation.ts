import { Injectable } from "@nestjs/common";
import { ConversationCreateDto, ConversationUpdateDto } from "../dto";
import { ConversationRepository } from "../repositories";

@Injectable({})
export class ConversationValidation {
    constructor(private conversationRepository: ConversationRepository){}

    async checkCreateConversation(conversation: ConversationCreateDto) {
        const conversationCheck = await this.conversationRepository.getConversationByName(conversation.conversationName);
        if (conversationCheck) {
            return 'conversation name exists!'
        }
        return '';
    }

    async checkUpdateConversation(conversation: ConversationUpdateDto) {
        const conversationCheck = await this.conversationRepository.getConversationByName(conversation.conversationName);
        if (conversationCheck) {
            return 'conversation name exists!'
        }
        return '';
    }

    async checkUserFromConversationByUserId(conversationId: string, userId: string) {
        const result = await this.conversationRepository.checkUserFromConversationByUserId(conversationId, userId);

        if(result) {
            return 'user exists in conversation!'
        }
        
        return '';
    }
}