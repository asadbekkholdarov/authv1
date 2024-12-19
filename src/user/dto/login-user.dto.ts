import { IsString, IsEmail , IsNotEmpty} from "class-validator";

export class LoginUserDto {
  @IsString()
  @IsNotEmpty()
  password: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

}