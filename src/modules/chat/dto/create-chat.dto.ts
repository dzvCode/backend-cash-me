import { IsNotEmpty } from "class-validator";

export class CreateChatDto {

    @IsNotEmpty()
    readonly roomId: string;

    @IsNotEmpty()
    readonly content: string;
}
