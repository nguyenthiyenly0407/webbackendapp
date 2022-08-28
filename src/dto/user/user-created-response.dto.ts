
import { ApiProperty } from "@nestjs/swagger";
export class UserCreatedResponse {
    @ApiProperty()
    userId: string;

    constructor(partial: Partial<UserCreatedResponse>) {
        Object.assign(this, partial);
    }
}