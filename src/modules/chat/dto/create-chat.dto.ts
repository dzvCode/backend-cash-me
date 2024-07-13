import { IsNotEmpty } from "class-validator";

export class CreateChatDto {

    @IsNotEmpty()
    readonly roomId: string;

    @IsNotEmpty()
    content: string;
}
