import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FirebaseUploadUtil } from '../../utils/firebase-upload.util';
import { FriendRequest, FriendRequestSchema, User, UserSchema } from '../../entity';
import { FriendRequestRepository, UserRepository } from '../../repositories';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }, {name: FriendRequest.name, schema: FriendRequestSchema}]),
    ],
    controllers: [UserController],
    providers: [UserRepository,FirebaseUploadUtil, UserService, FriendRequestRepository],
    exports: []
})
export class UserModule {}
