import { User } from "src/modules/users/interfaces/user.interface";

export class LoginResponseDto {    
    accessToken: string;
    refreshToken: string;    
    user: User;
}