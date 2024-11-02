import { IsNotEmpty, IsPositive } from "class-validator";

export class DepositFundsDto {
    
    @IsNotEmpty()
    @IsPositive()
    amount: number;
  }