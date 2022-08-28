import { ApiProperty } from "@nestjs/swagger";

export class MessageAllFiles {

    @ApiProperty()
    images: [string];
    @ApiProperty()
    files: [string];
    @ApiProperty()
    videos: [string];
}