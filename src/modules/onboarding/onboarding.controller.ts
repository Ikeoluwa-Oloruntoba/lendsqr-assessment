import { BadRequestException, Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { OnboardingService } from './onboarding.service';
import { CreateUserDTO } from './dto/createUser.dto';
import { UpgradeKycDto } from './dto/upgrade-kyc.dto';
import { GetUser } from 'src/common/decorators/get-current-user.decorator';
import { UserGuard } from 'src/common/guards/user.guard';

@Controller('onboarding')
export class OnboardingController {
  constructor(private readonly onboardingService: OnboardingService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async onboardUser(@Body() onboardUserDto: CreateUserDTO): Promise<{ message: string }> {
    const onboarded = await this.onboardingService.createAccount(onboardUserDto);
    if (!onboarded) {
      throw new BadRequestException('User could not be onboarded');
    }
    return { message: 'User onboarded successfully' };
  }

  @Post('upgrade-kyc')
  @HttpCode(HttpStatus.OK)
  @UseGuards(UserGuard)
  async upgradeKyc(@Body() upgradeKycDto: UpgradeKycDto, @GetUser() user: any): Promise<{ message: string }> {
    const upgraded = await this.onboardingService.upgradeAccount(user.id, upgradeKycDto);
    if (!upgraded) {
      throw new BadRequestException('KYC upgrade failed');
    }
    return { message: 'KYC upgrade successful' };
  }
}
