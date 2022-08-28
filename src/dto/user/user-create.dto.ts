import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";
import { Account } from "../../entity/models/account.model";

export class UserCreateDto {
    @ApiProperty()
    fullname: string;

    @IsNotEmpty()
    @ApiProperty()
    account: Account;

    @IsEmail()
    @ApiProperty()
    email: string;

    @ApiProperty()
    phone: string;    
}