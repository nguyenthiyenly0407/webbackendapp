import { InternalServerErrorException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ConversationCreateDto, FilterParamDto, ListConversationResponseDto, ConversationUpdateDto, MessageResponseDto } from "../dto";
import { MessageModel } from "src/entity/models/message.model";
import { User, Conversation } from "../entity";
import { OWNER_ID_ONE_TO_ONE } from "../config/constants";
const mongoose = require('mongoose');


export class ConversationRepository {
    constructor(
        @InjectModel(Conversation.name) private readonly conversationModel: Model<Conversation>,
        @InjectModel(User.name) private readonly userModel: Model<User>
    ) {

    }

    async createConversation(ownerId: string, conversation: ConversationCreateDto) {
        try {
            let users = [];
            for (let userId of conversation.arrayUserId) {
                const user = await this.userModel.findById(userId);
                if (userId === ownerId || ownerId===OWNER_ID_ONE_TO_ONE) {
                    users.push({
                        userId: user._id,
                        role: 'owner-admin'
                    });
                }else {
                    users.push({
                        userId: user._id,
                        role: 'member'
                    });
                }
            }
            const newConversation = await new this.conversationModel(
                {
                    conversationName: conversation.conversationName,
                    users: users,
                    createdAt: new Date().getTime(),
                    updatedAt: new Date().getTime()
                }
            ).save();
            return newConversation;
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }

    async addUsersToGroup(litsUserId: string[], conversationId: string) {
        try {
            const conversation = await this.conversationModel.findById(conversationId);

            let users = conversation.users;
            for (let userId of litsUserId) {
                const user = await this.userModel.findById(userId);
                users.push({
                    userId: user._id,
                    role: "member"
                });
            }
            await this.conversationModel.updateOne(
                { _id: conversationId },
                {
                    $set: ({ users: users, updatedAt: new Date().getTime() })
                }
            );
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }

    async getConversationById(conversationId: string) {
        try {
            const id = mongoose.Types.ObjectId(conversationId);
            const conversations = await this.conversationModel.aggregate([
                {
                    $match: { _id: id }
                },
                {
                    $sort: { updatedAt: -1 }
                },
                { $unwind: "$users" },
                {
                    $lookup: {
                        from: "users",
                        localField: "users.userId",
                        foreignField: "_id",
                        as: "user"
                    }
                },
                { $unwind: "$user" },
                {
                    $group: {
                        _id: "$_id",
                        conversationName: { $last: "$conversationName" },
                        lastMessage: { $last: "$lastMessage" },
                        readStatus: { $last: "$readStatus" },
                        createdAt: { $last: "$createdAt" },
                        updatedAt: { $last: "$updatedAt" },
                        users: { "$push": "$user" },
                    }
                },
                {
                    $project: {
                        __v: 0,
                        "users.email": 0,
                        "users.fullname": 0,
                        "users.account.password": 0,
                        "users.phone": 0,
                        "users.createdAt": 0,
                        "users.updatedAt": 0,
                        "users.__v": 0
                    }
                }
            ]);
            const conversation = conversations[0];
            const con = await this.conversationModel.findOne({_id: id});
            for (let user of conversation.users) {
                for(let i of con.users) {
                    if (user._id.toString() === i.userId.toString()) {
                        user.account.role = i.role;
                    }
                }
            }
            return conversation;
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }

    async getConversationByName(conversationName: string) {
        try {
            const conversation = await this.conversationModel.findOne({ conversationName: conversationName });
            return conversation;
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }

    async getAll(filters: FilterParamDto, userId: string) {
        try {
            const page = filters.page ? filters.page : 1;
            const perpage = filters.perPage ? filters.perPage : 10;
            const skip = (page - 1) * perpage;
            const id = mongoose.Types.ObjectId(userId);
            const options = filters.search ? {
                conversationName: { $regex: filters.search },
                "users.userId": id
            } : { "users.userId": id };
            const conversations = await this.conversationModel.aggregate([
                {
                    $match: options
                },
                {
                    $sort: { updatedAt: -1 }
                },
                { $unwind: "$users" },
                {
                    $lookup: {
                        from: "users",
                        localField: "users.userId",
                        foreignField: "_id",
                        as: "user"
                    }
                },
                { $unwind: "$user" },
                {
                    $group: {
                        _id: "$_id",
                        conversationName: { $last: "$conversationName" },
                        lastMessage: { $last: "$lastMessage" },
                        readStatus: { $last: "$readStatus" },
                        createdAt: { $last: "$createdAt" },
                        updatedAt: { $last: "$updatedAt" },
                        users: { "$push": "$user" },
                    }
                },
                {
                    $project: {
                        __v: 0,
                        "users.email": 0,
                        "users.fullname": 0,
                        "users.account.password": 0,
                        "users.phone": 0,
                        "users.createdAt": 0,
                        "users.updatedAt": 0,
                        "users.__v": 0
                    }
                },
                {
                    $skip: skip
                }, {
                    $limit: Number(perpage)
                }
            ]);
            const total = await this.conversationModel.count({ "users.userId": id });
            const data = new ListConversationResponseDto({ total, data: conversations });
            return data;
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }

    async updateLastMessageAndClearReadStatusConversation(message: MessageResponseDto, conversationId: string) {
        const lastMessage = message as MessageModel;
        await this.conversationModel.updateOne(
            { _id: conversationId },
            {
                $set: ({ lastMessage: lastMessage, readStatus: [], updatedAt: new Date().getTime() })
            }
        );
    }

    async updateConversation(conversationId: string, conversation: ConversationUpdateDto) {
        try {
            const conversationUpdate = await this.conversationModel.findById(conversationId);
            conversationUpdate.conversationName = conversation.conversationName;
            conversationUpdate.updatedAt = new Date().getTime();
            await this.conversationModel.updateOne({ _id: conversationId }, conversationUpdate);
            return conversationUpdate;
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }

    async updateReadStatus(userId: string, conversationId: string) {
        const conversation = await this.getConversationById(conversationId);
        let readStatus = conversation.readStatus;

        if (!readStatus.includes(userId)) {
            readStatus.push(userId);
        }

        await this.conversationModel.updateOne(
            { _id: conversationId },
            {
                $set: ({ readStatus: readStatus })
            }
        );
    }

    async checkUserFromConversationByUserId(conversationId, userId: string) {
        const conversation = await this.conversationModel.find(
            {
                _id: mongoose.Types.ObjectId(conversationId),
                "users.userId": mongoose.Types.ObjectId(userId)
            });

        if (conversation.length) {
            return true;
        }
        return false;
    }

    async removeUserFromConversation(conversationId: string, userId: string) {
        try {
            const conversation = await this.conversationModel.findById(conversationId);
            const users = conversation.users;
            const index = users.findIndex(user => user.userId == userId);
            users.splice(index, 1);
            await this.conversationModel.updateOne(
                { _id: conversationId },
                {
                    $set: ({ users: users, updatedAt: new Date().getTime() })
                }
            );
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
        
        
    }

    async changeRoleForUser(conversationId: string, userId: string, role: string) {
        const conversation = await this.conversationModel.findOne({_id: conversationId});
        const users = conversation.users;
        for (let user of users) {
            if (user.userId.toString() === userId) {
                user.role = role;
            }
        }
        
        await this.conversationModel.updateOne(
            {_id: mongoose.Types.ObjectId(conversationId)},
            {
                $set: ({users})
            }
        )
    }

    async findRoleConversationByUserId(conversationId: string, userId: string) {
        const conversation = await this.conversationModel.findOne({_id: conversationId});
        for (let user of conversation.users) {
            if (user.userId.toString() === userId) {
                return user.role;
            }
        }
        return null;
    }

    async removeConversation(conversationId: string) {
        const conversation = await this.conversationModel.findOne({_id: conversationId});
        await conversation.remove()
    }

    async leaveConversation(conversationId: string, userId: string) {
        const conversation = await this.conversationModel.findOne({_id: conversationId});
        const users = conversation.users.filter(item => item.userId.toString() !== userId);
        await this.conversationModel.updateOne(
            {_id: conversationId},
            {
                $set: ({users})
            }
        );
    }

    async findOneToOneByUserId(userId: string) {
        const id = mongoose.Types.ObjectId(userId);
        const conversations = await this.conversationModel.find(
            {
                conversationName: 'one-to-one-codingclub',
                "users.userId": id
            }
        );
        return conversations;
    }
}