
export class MessageCreateDto {

    conversationId: string;

    content?: string[];

    description?: string;

    type?: string;

    fromUserId?: string;

    createdAt?: number;

    status?: string;
}