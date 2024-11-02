import { IsNotEmpty, IsPositive } from "class-validator";

export class WithdrawFundsDto {

    @IsNotEmpty()
    @IsPositive()
    amount: number;
  }