import { InternalServerErrorException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { FilterParamDto, ListUserResponse, UserUpdateDto, UserCreateDto, UserUpdateDtoResponse, AccountResponseDto } from "../dto";
import { User } from "../entity/user.entity";


export class UserRepository {
    constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {

    }

    async createUser(user: UserCreateDto) {
        try {
            const newUser = await new this.userModel({
                ...user,
                createdAt: new Date().getTime(),
                updatedAt: new Date().getTime()
            }).save();
            return newUser;
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }

    async findOneByUsername(username: string) {
        try {
            const user = await this.userModel.findOne({ "account.username": username });
            return user;
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }

    async findByUsernameOrEmailOrPhone(email: string, username: string, phone: string) {
        try {
            const user = await this.userModel.find({
                $or: [
                    { email },
                    { "account.username": username },
                    { phone }
                ]
            });
            return user[0];
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }

    async findById(userId: string) {
        try {
            const user = await this.userModel.findById(userId, {
                __v: 0,
                "account.password": 0
            });
            return user;
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }

    async findAll(filters: FilterParamDto) {
        try {
            const page = filters.page ? filters.page : 1;
            const perpage = filters.perPage ? filters.perPage : 10;
            const skip = (page - 1) * perpage;
            const options = filters.search ? {
                $or: [
                    { "account.username": { $regex: filters.search } },
                    { email: { $regex: filters.search } },
                    { phone: { $regex: filters.search } }
                ]
            } : {};
            const users = await this.userModel.find(options, { __v: 0, "account.password": 0 }).skip(skip).limit(perpage).sort({ "account.username": 1 });
            const total = await this.userModel.count();
            const data = new ListUserResponse({ total, data: users });
            return data;
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }

    async updateUserProfile(userId: string, user: UserUpdateDto) {
        try {
            const updatedUser = await this.userModel.findByIdAndUpdate(userId, {
                ...user,
                updatedAt: new Date().getTime()
            }, { new: true });
            const updatedUserResponse = new UserUpdateDtoResponse(updatedUser.toObject());
            updatedUserResponse.account= {
                username: updatedUser.account.username
            }
            return updatedUserResponse;
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }

    async updateIsloginFirst(id: string) {
        await this.userModel.updateOne(
            {_id: id},
            {
                $set: ({isLoginFirst: true})
            }
        )
    }
}