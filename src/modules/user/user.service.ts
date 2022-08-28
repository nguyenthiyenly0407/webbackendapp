import { Injectable } from "@nestjs/common";
import { FilterParamDto, UserResponseDto, UserUpdateDto } from "../../dto";
import { FriendRequestRepository, UserRepository } from "../../repositories";

@Injectable({})
export class UserService {

    constructor(private userRepository: UserRepository, private friendRequestRepository: FriendRequestRepository) { }

    async findById(userId: string) {
        return await this.userRepository.findById(userId);
    }

    async findAll(filters: FilterParamDto, userId: string) {
        let list = [];
        const users = await this.userRepository.findAll(filters);
        const listFriendRequest = await this.friendRequestRepository.findByToUserIdOrFromUserId(userId);
        for (let user of users.data) {
            let data: UserResponseDto = {
                _id: user._id,
                account: user.account,
                avatarUrl: user.avatarUrl,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
                email: user.email,
                fullname: user.fullname,
                phone: user.phone,
            };
            

            if (listFriendRequest.length) {
                for(let item of listFriendRequest) {
                    if (user._id.toString() === item.fromUserId.toString()) {
                        data.friendRequestStatus = 'pending';
                        if (item.status === 'approve') {
                            data.friendRequestStatus = 'friend';
                        }
                        break;
                    }
                    if (user._id.toString() === item.toUserId.toString()) {
                        data.friendRequestStatus = 'request sent';
                        
                        if (item.status === 'approve') {
                            data.friendRequestStatus = 'friend';
                            if (item.status === 'approve') {
                                data.friendRequestStatus = 'friend';
                            }
                        }
                        break;
                    }
                    data.friendRequestStatus = 'none';
                }
            }else {
                data.friendRequestStatus = 'none';
            }
            list.push(data);
        }
        list = list.filter(item => item._id.toString() !== userId);
        return list;
    }

    async updateUserProfile(userId: string, user: UserUpdateDto) {
        return await this.userRepository.updateUserProfile(userId, user);
    }

}