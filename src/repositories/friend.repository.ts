import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { FilterParamDto } from "../dto";
import { Friend } from "../entity";
const mongoose = require('mongoose');
export class FriendRepository {
    constructor(
        // @InjectModel(Conversation.name) private readonly conversationModel: Model<Conversation>,
        // @InjectModel(User.name) private readonly userModel: Model<User>
        @InjectModel(Friend.name) private readonly friendModel: Model<Friend>,
    ){}

    async createFriend(userId: string, friendId: string) {
        const friend = await new this.friendModel({
            userId,
            friendId,
            createdAt: new Date().getTime(),
            isDeleted: false,
            updatedAt: new Date().getTime()
        }).save();

        return friend;
    }

    async deleteFriend(userId: string, friendId: string) {
        await this.friendModel.updateOne(
            {userId: userId, friendId: friendId},
            {
                $set: ({isDeleted: false, updatedAt: new Date().getTime()})
            }
        )

        return true;
    }
    
    async findAll(userId: string, filters: FilterParamDto) {
        const page = filters.page ? filters.page : 1;
        const perpage = filters.perPage ? filters.perPage : 20;
        const skip = (page - 1)*perpage;
        const uid = mongoose.Types.ObjectId(userId);
        console.log(userId);
        
        const list = await this.friendModel.aggregate([
            {
                $match: {userId: uid}
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'friendId',
                    foreignField: '_id',
                    as: "friend"
                }
            },
            {$unwind: '$friend'},
            {
                $project: {
                    "__v": 0,
                    "userId": 0,
                    "friendId": 0,
                    "friend.account.password": 0,
                    "friend.__v": 0,
                    // "friend.fullname": 0,
                    "friend.email": 0,
                    "friend.phone": 0,
                    "friend.createdAt": 0,
                    "friend.updatedAt": 0,
                }
            },
            {
                $sort: {createdAt: -1}
            },
            {
                $skip: skip
            }, {
                $limit: perpage
            }
        ]);
        return list;
    }

    async findById(id: string) {
        const uid = mongoose.Types.ObjectId(id);
        
        const list = await this.friendModel.aggregate([
            {
                $match: {_id: uid}
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'friendId',
                    foreignField: '_id',
                    as: "friend"
                }
            },
            {$unwind: '$friend'},
            {
                $project: {
                    "__v": 0,
                    "userId": 0,
                    "friendId": 0,
                    "friend.account.password": 0,
                    "friend.__v": 0,
                    // "friend.fullname": 0,
                    "friend.email": 0,
                    "friend.phone": 0,
                    "friend.createdAt": 0,
                    "friend.updatedAt": 0,
                }
            },
            {
                $sort: {createdAt: -1}
            },
        ]);
        return list[0];
    }

    async removeFriend(userId: string, friendId: string) {
        const friend = await this.friendModel.findOne({userId,friendId});
        await friend.remove();
    }
}