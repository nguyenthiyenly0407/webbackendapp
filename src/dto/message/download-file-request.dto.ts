import { ApiProperty } from "@nestjs/swagger";

export class DownloadFileRequestDto {
    @ApiProperty()
    url: string;
}