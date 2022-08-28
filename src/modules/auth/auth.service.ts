import { Injectable } from "@nestjs/common";
import { LoginRequestDto, SendOTPRequestDto, UserCreateDto, ValidateEmailRequest } from "../../dto";
import { UserRepository } from "../../repositories/user.repository";
import * as bcrypt from 'bcrypt';
import { JwtService } from "@nestjs/jwt";
import { MailerService } from "@nestjs-modules/mailer";

@Injectable({})
export class AuthService {

    constructor(
        private userRepository: UserRepository, 
        private jwtService: JwtService,
        private mailerService: MailerService){}

    async login(account: LoginRequestDto) {
        const user = await this.userRepository.findByUsernameOrEmailOrPhone(account.username, account.username, account.username);
        if (!user) {
            return null;
        }
        const isMatch = await bcrypt.compare(account.password, user.account.password);

        if (isMatch) {
            const payload = {userId: user._id}
            const token= this.generateToken(payload);
            if (!user.isLoginFirst) {
                await this.userRepository.updateIsloginFirst(user._id.toString());
            }
            return {token,userId: user._id, isLoginFirst: user.isLoginFirst};
        }else {
            return null;
        }
    }

    async register(user: UserCreateDto) {
        user.account.password = await this.generatePassword(user.account.password);
        const newUser = await this.userRepository.createUser(user);

        return newUser;
    }

    private async generatePassword(plainPassword: string) {
        const saltOrRounds = 10;
        const password = await bcrypt.hash(plainPassword, saltOrRounds);

        return password;
    }

    private generateToken(payload: any): string {
        return this.jwtService.sign(payload);
    }

    async sendOTPComfirm(otp: number, request: SendOTPRequestDto) {
        const res = await this.mailerService.sendMail({
            to: request.email,
            subject: 'Coding Club OTP confirm!',
            template: './otp-confirm',
            context: {
                name: request.fullname,
                otp: otp,
            }
        });
        console.log(res);
        
    }

    async validateValueUser(data: ValidateEmailRequest) {
        const user = await this.userRepository.findByUsernameOrEmailOrPhone(data.email, data.username, data.phone);
        if (user) {
            return true;
        }
        return false;
    }
}