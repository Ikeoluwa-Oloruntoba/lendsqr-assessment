import { IsNotEmpty } from "class-validator";

export class UpgradeKycDto {
  
  @IsNotEmpty()
  kycLevel: 'BASIC' | 'SILVER' | 'GOLD'; 

  @IsNotEmpty()
  kycDocument: string;
}