import { ApiBearerAuth, ApiOkResponse, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Body, Controller, Get, Param, Post, Query, Req, Res, UseGuards } from "@nestjs/common";
import { FriendService } from "./friend.service";
import { FilterParamDto, FriendApproveDto, FriendRequestCreateDto, FriendRequestResponseDto, FriendResponseDto, InternalServerErrorDTO, ResourceNotFoundException, Successful, UnFriendRequest } from "../../dto";
import { Response } from "express";
import { JwtAuthGuard } from "../auth/auth.guard";
@ApiBearerAuth()
@ApiTags('api/friends')
@Controller('api/friends')
export class FriendController {

    constructor(private friendService: FriendService) { }

    @Post("request")
    @ApiOkResponse({
        status: 200,
        type: Successful,
    })
    @ApiResponse({
        status: 500,
        description: 'error',
        type: InternalServerErrorDTO,
        isArray: false
    })
    @UseGuards(JwtAuthGuard)
    async createFirendRequest(@Req() req, @Res() res: Response, @Body() body: FriendRequestCreateDto) {
        try {
            const userId = req.user['userId'];

            await this.friendService.createFriendRequest(userId, body.toUserId);

            return res.status(200).json(new Successful('OK'));

        } catch (error) {
            console.log(error);
            return res.status(500).json(new InternalServerErrorDTO());
        }
    }

    @Post("request/approve")
    @ApiOkResponse({
        status: 200,
        type: Successful,
    })
    @ApiResponse({
        status: 500,
        description: 'error',
        type: InternalServerErrorDTO,
        isArray: false
    })
    @UseGuards(JwtAuthGuard)
    async approveFriend(@Req() req, @Res() res: Response, @Body() body: FriendApproveDto) {
        try {
            const userId = req.user['userId'];
            await this.friendService.approveFriend(body.fromUserId, userId);
            return res.status(200).json(new Successful('OK'));
        } catch (error) {
            console.log(error);
            return res.status(500).json(new InternalServerErrorDTO());
        }
    }

    @Post("request/reject")
    @ApiOkResponse({
        status: 200,
        type: Successful,
    })
    @ApiResponse({
        status: 500,
        description: 'error',
        type: InternalServerErrorDTO,
        isArray: false
    })
    @UseGuards(JwtAuthGuard)
    async rejectFriend(@Req() req, @Res() res: Response, @Body() body: FriendApproveDto) {
        try {
            const userId = req.user['userId'];
            await this.friendService.rejectFriend(body.fromUserId, userId);
            return res.status(200).json(new Successful('OK'));
        } catch (error) {
            console.log(error);
            return res.status(500).json(new InternalServerErrorDTO());
        }
    }

    @Get('request')
    @ApiOkResponse({
        status: 200,
        type: FriendRequestResponseDto,
        isArray: true
    })
    @ApiResponse({
        status: 500,
        description: 'error',
        type: InternalServerErrorDTO,
        isArray: false
    })
    @UseGuards(JwtAuthGuard)
    async getAllFriendRequest(@Req() req, @Res() res: Response, @Query() filters: FilterParamDto) {
        try {
            const userId = req.user['userId'];
            const list = await this.friendService.getAllFriendRequest(userId, filters);
            return res.status(200).json(list);
        } catch (error) {
            console.log(error);
            return res.status(500).json(new InternalServerErrorDTO());
        }
    }

    @Get('')
    @ApiOkResponse({
        status: 200,
        type: FriendResponseDto,
        isArray: true
    })
    @ApiResponse({
        status: 500,
        description: 'error',
        type: InternalServerErrorDTO,
        isArray: false
    })
    @UseGuards(JwtAuthGuard)
    async getAllFriend(@Req() req, @Res() res: Response, @Query() filters: FilterParamDto) {
        try {
            const userId = req.user['userId'];
            const list = await this.friendService.getAllFriend(userId, filters);

            return res.status(200).json(list);
        } catch (error) {
            console.log(error);
            return res.status(500).json(new InternalServerErrorDTO());
        }
    }

    @Post("request/user/:id/remove")
    @ApiOkResponse({
        status: 200,
        type: Successful,
    })
    @ApiResponse({
        status: 500,
        description: 'error',
        type: InternalServerErrorDTO,
        isArray: false
    })
    @ApiResponse({
        status: 404,
        description: 'not found',
        type: ResourceNotFoundException,
    })
    @UseGuards(JwtAuthGuard)
    async removeFriendRequestAfterRequest(@Req() req, @Res() res: Response, @Param("id") toUserId: string) {
        try {
            const userId = req.user['userId'];
            await this.friendService.removeFriendRequestAfterRequest(userId, toUserId);
            return res.status(200).json(new Successful('Removed'));
        } catch (error) {
            console.log(error);
            return res.status(500).json(new InternalServerErrorDTO());
        }
    }

    @Post("/unfriend")
    @ApiOkResponse({
        status: 200,
        type: Successful,
    })
    @ApiResponse({
        status: 500,
        description: 'error',
        type: InternalServerErrorDTO,
        isArray: false
    })
    @UseGuards(JwtAuthGuard)
    async unfriend(@Req() req, @Res() res: Response,  @Body() body: UnFriendRequest) {
        try {
            const userId = req.user['userId'];
            await this.friendService.removeFriend(userId, body.friendId);
            return res.status(200).json(new Successful('OK'));
        }catch (error) {
            console.log(error);
            return res.status(500).json(new InternalServerErrorDTO());
        }
    }
}