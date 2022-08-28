import { ApiProperty } from "@nestjs/swagger";
import { ListResponse } from "../core";
import { UserResponseDto } from "./user-response.dto";

export class ListUserResponse extends ListResponse {

    @ApiProperty({
        type: UserResponseDto,
        isArray: true
    })
    data: UserResponseDto[];

    constructor(partial: Partial<ListUserResponse>) {
        super();
        Object.assign(this, partial);
    }
}