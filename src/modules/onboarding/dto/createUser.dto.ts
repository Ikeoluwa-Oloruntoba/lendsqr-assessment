import { IsEmail, IsNotEmpty, IsOptional } from "class-validator";

export class CreateUserDTO {

    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    password: string;

    @IsOptional()
    kycDocument?: string; 
    
  }