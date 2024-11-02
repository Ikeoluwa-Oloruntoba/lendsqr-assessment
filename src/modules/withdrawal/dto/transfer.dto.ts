import { IsEmail, IsNotEmpty, IsPositive } from "class-validator";

export class TransferFundsDto {

    @IsNotEmpty()
    @IsEmail()
    toUserId: string;

    @IsNotEmpty()
    @IsPositive()
    amount: number;
    
  }