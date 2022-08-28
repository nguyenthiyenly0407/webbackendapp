import { Body, CACHE_MANAGER, Controller, HttpStatus, Inject, Post, Res } from "@nestjs/common";
import { ApiOkResponse, ApiResponse, ApiTags } from "@nestjs/swagger/dist";
import { Response } from "express";
import { UserValidation } from "../../validations";
import { AuthResponseDto, BadRequestErrorDto, InternalServerErrorDTO, LoginRequestDto, ResourceNotFoundException, SendOTPRequestDto, Successful, UserCreatedResponse, UserCreateDto, ValidateEmailRequest, ValidateOTPRequestDto } from "../../dto";
import { AuthService } from "./auth.service";
import { Cache } from "cache-manager";


@ApiTags('/api/auth')
@Controller('api/auth')
export class AuthController{
    constructor (
        private authService: AuthService, 
        private userValidation: UserValidation,
        @Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

    @ApiOkResponse({
        status: 200,
        type:  AuthResponseDto,
        isArray: false
    })
    @ApiResponse({
        status: 400,
        description: 'bad request',
        type:  BadRequestErrorDto,
        isArray: false
    })
    @ApiResponse({
        status: 500,
        description: 'error server',
        type:  InternalServerErrorDTO,
        isArray: false
    })
    @Post('login')
    async login(@Body() loginReq: LoginRequestDto, @Res() res: Response) {
        try {
            const response = await this.authService.login(loginReq);
            if (response !== null){
                return res.status(HttpStatus.OK).json(response);
            }else {
                return res.status(HttpStatus.BAD_REQUEST).json(new BadRequestErrorDto(["Incorrect password!"]));
            }
        }catch(error) {
            console.log(error);
            return res.status(500).json(new InternalServerErrorDTO());
        }
    }

    @ApiOkResponse({
        status: 200,
        type:  UserCreatedResponse,
        isArray: false
    })
    @ApiResponse({
        status: 400,
        description: 'bad request',
        type:  BadRequestErrorDto,
        isArray: false
    })
    @ApiResponse({
        status: 500,
        description: 'error',
        type:  InternalServerErrorDTO,
        isArray: false
    })
    @Post('register')
    async register(@Body() userReq: UserCreateDto,  @Res() res: Response) {
        try {
            const messageValidation = await this.userValidation.checkValidateCreateUser(userReq);
            if(messageValidation.toString().length) {
                return res.status(400).json(new BadRequestErrorDto([messageValidation]));
            }
            const newUser =  await this.authService.register(userReq);
            return res.status(200).json(new UserCreatedResponse({userId: newUser._id}));
        }catch(error) {
            console.log(error);
            return res.status(500).json(new InternalServerErrorDTO());  
        }
    }

    @Post('send-otp')
    async sendOTP(@Res() res: Response,@Body() body: SendOTPRequestDto) {
        try {
            const otp = Math.floor(Math.random() * (999999 - 100000)) + 100000;

            await this.authService.sendOTPComfirm(otp, body);
            await this.cacheManager.set(body.email, otp);
            console.log('========================> otp: ',otp);
            
            
            return res.status(200).json(new Successful('OK'));
        }catch(error) {
            console.log(error);
            return res.status(500).json(new InternalServerErrorDTO());  
        }
    }

    @Post('validate-otp')
    async validateOtp(@Res() res: Response, @Body() body: ValidateOTPRequestDto) {
        try {
            const otp = await this.cacheManager.get(body.email);
            if (otp && otp.toString() === body.otp) {
                return res.status(200).json(new Successful('OK'));
            }else {
                return res.status(400).json(new BadRequestErrorDto(['OTP invalid!']))
            }
        }catch(error) {
            console.log(error);
            return res.status(500).json(new InternalServerErrorDTO());  
        }
    }

    @Post('validate-email')
    async validateEmail(@Res() res: Response, @Body() body: ValidateEmailRequest) {
        try {
            const result = await this.authService.validateValueUser(body);
            if (result) {
                return res.status(404).json(new ResourceNotFoundException('email or phone or username exists!'));
            }
            return res.status(200).json(new Successful('OK'));
        }catch(error) {
            console.log(error);
            return res.status(500).json(new InternalServerErrorDTO());
        }
    }
}
