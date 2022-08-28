import { Body, Controller, Get, HttpStatus, Param, Put, Query, Req, Res, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOkResponse, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Request, Response } from "express";
import { FirebaseUploadUtil } from "../../utils/firebase-upload.util";
import { FilterParamDto, InternalServerErrorDTO,ResourceNotFoundException, ListUserResponse, UserResponseDto, UserUpdateDto, UserUpdateDtoResponse } from "../../dto";
import { JwtAuthGuard } from "../auth/auth.guard";
import { UserService } from "./user.service";

@ApiBearerAuth()
@ApiTags('api/users')
@Controller('api/users')
export class UserController {
    constructor(private userService: UserService, private firebase: FirebaseUploadUtil) { }

    @ApiOkResponse({
        status: 200,
        type: UserResponseDto,
        isArray: false
    })
    @ApiResponse({
        status: 500,
        description: 'error',
        type: InternalServerErrorDTO,
        isArray: false
    })
    @Get('/me')
    @UseGuards(JwtAuthGuard)
    async getUserDeltail(@Req() req: Request, @Res() res: Response) {
        try {
            const userId = req.user['userId'];
            const user = await this.userService.findById(userId);
            return res.status(HttpStatus.OK).json(user);
        } catch (error) {
            console.log(error);
            return res.status(500).json(new InternalServerErrorDTO());
        }
    }


    @ApiOkResponse({
        status: 200,
        type: ListUserResponse,
    })
    @ApiResponse({
        status: 500,
        description: 'error',
        type: InternalServerErrorDTO,
        isArray: false
    })
    @Get('')
    @UseGuards(JwtAuthGuard)
    async getAllUser(@Req() req, @Res() res: Response, @Query() filters: FilterParamDto) {
        try {
            const userId = req.user['userId'];
            const users = await this.userService.findAll(filters, userId);
            return res.status(200).json(users);
        } catch (error) {
            console.log(error);
            return res.status(500).json(new InternalServerErrorDTO());
        }
    }

    @ApiOkResponse({
        status: 200,
        type: UserUpdateDtoResponse,
    })
    @ApiResponse({
        status: 500,
        description: 'error',
        type: InternalServerErrorDTO,
    })
    @ApiResponse({
        status: 404,
        description: 'not found',
        type: InternalServerErrorDTO,
    })
    @ApiOperation({ summary: 'update user profile' })
    @ApiParam({ name: 'userId', required: true })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                fullname: {
                    type: 'string',
                    format: 'string',
                },
                avatar: {
                    type: 'string',
                    format: 'binary',
                    nullable: false
                },
                phone: {
                    type: 'string',
                    format: 'string',
                },
                about: {
                    type: 'string',
                    format: 'string',
                },
                yearOrBirth: {
                    type: 'number',
                    format: 'int32',
                }
            }
        }
    })
    @UseInterceptors(FileInterceptor('avatar'))
    @Put(':userId')
    @UseGuards(JwtAuthGuard)
    async updateUserProfile(@Res() res: Response, @Param('userId') userId: string, @Body() body , @UploadedFile() file: Express.Multer.File) {

        try {
            let user: UserUpdateDto={
                fullname: body.fullname,
                // avatarUrl: url,
                phone: body.phone,
                about: body.about,
                yearOrBirth: body.yearOrBirth
            }
            if (file) {
                await this.firebase.uploadFile(file);
                const url = this.firebase.getUrlUpload(file.originalname);
                user.avatarUrl = url;
            }
            const userUpdate = await this.userService.updateUserProfile(userId, user);
            return res.status(200).json(userUpdate);
        } catch (error) {
            console.log(error);
            return res.status(500).json(new InternalServerErrorDTO());
        }
    }
}