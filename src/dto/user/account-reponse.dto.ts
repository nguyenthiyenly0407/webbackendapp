import { ApiProperty } from "@nestjs/swagger";

export class AccountResponseDto {
    @ApiProperty()
    username: string; 
    
    constructor(params: Partial<AccountResponseDto>) {
        Object.assign(this, params);
    }
}