import { IsString, IsEmail , IsNotEmpty} from "class-validator";

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  password: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  username:  string;
}