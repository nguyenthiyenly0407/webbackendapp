import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { FilterParamDto } from "../dto";
import { FriendRequest, User } from "../entity";
const mongoose = require('mongoose');

export class FriendRequestRepository {
    constructor(
        @InjectModel(FriendRequest.name) private readonly friendRequestModel: Model<FriendRequest>,
        @InjectModel(User.name) private readonly userModel: Model<any>,
    ) { }

    async createFriendRequest(fromUserId: string, toUserId: string) {
        const friendRequest = await new this.friendRequestModel({
            fromUserId: fromUserId,
            toUserId: toUserId,
            status: "pending",
            createdAt: new Date().getTime(),
            updatedAt: new Date().getTime()
        }).save();

        return friendRequest;
    }

    async updateStatus(status: string, fromUserId: string, toUserId: string) {
        await this.friendRequestModel.updateOne(
            {fromUserId, toUserId},
            {
                $set: ({ status, updatedAt: new Date().getTime() })
            }
        );
        if (status === 'reject') {
            await this.friendRequestModel.findOne({fromUserId, toUserId}).remove();
        }
        return true;
    }

    async findById(id: string) {
        const uid = mongoose.Types.ObjectId(id);

        const list = await this.friendRequestModel.aggregate([
            {
                $match: { _id: uid }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'fromUserId',
                    foreignField: '_id',
                    as: "fromUser"
                }
            },
            { $unwind: '$fromUser' },
            {
                $project: {
                    "__v": 0,
                    "status": 0,
                    "fromUser.account.password": 0,
                    "fromUser.__v": 0,
                    "fromUser.fullname": 0,
                    "fromUser.email": 0,
                    "fromUser.phone": 0,
                    "fromUser.createdAt": 0,
                    "fromUser.updatedAt": 0,
                }
            }
        ]);
        return list[0];
    }

    async findAll(userId: string, filters: FilterParamDto) {
        const page = filters.page ? filters.page : 1;
        const perpage = filters.perPage ? filters.perPage : 10;
        const skip = (page - 1) * perpage;
        const uid = mongoose.Types.ObjectId(userId);

        const list = await this.friendRequestModel.aggregate([
            {
                $match: { toUserId: uid, status: 'pending' }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'fromUserId',
                    foreignField: '_id',
                    as: "fromUser"
                }
            },
            { $unwind: '$fromUser' },
            {
                $project: {
                    "__v": 0,
                    "fromUserId": 0,
                    "toUserId": 0,
                    "status": 0,
                    "fromUser.account.password": 0,
                    "fromUser.__v": 0,
                    // "fromUser.fullname": 0,
                    "fromUser.email": 0,
                    "fromUser.phone": 0,
                    "fromUser.createdAt": 0,
                    "fromUser.updatedAt": 0,
                }
            },
            {
                $sort: { createdAt: -1 }
            },
            {
                $skip: skip
            }, {
                $limit: perpage
            }
        ]);
        return list;
    }

    async findByToUserIdOrFromUserId(userId: string) {
        const uid = mongoose.Types.ObjectId(userId);
        const list = await this.friendRequestModel.find(
            {
                $or: [
                    { toUserId: uid },
                    { fromUserId: uid }
                ]
            }
        );
        return list;
    }

    async removeFriendRequestAfterRequest(uesrRequestId: string, toUserId: string) {
        const friendRequest = await this.friendRequestModel.findOne({
            $and: [
                { fromUserId: mongoose.Types.ObjectId(uesrRequestId) },
                { toUserId: mongoose.Types.ObjectId(toUserId) }
            ]
        });
        if (friendRequest && friendRequest.status === 'pending') {
            await this.friendRequestModel.deleteOne({ _id: friendRequest._id });
        } else {
            throw new Error("Friend request not found or already accepted");
        }
    }

}