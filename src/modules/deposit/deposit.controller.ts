import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { DepositService } from './deposit.service';
import { UserGuard } from 'src/common/guards/user.guard';
import { DepositFundsDto } from './dto/deposit.dto';
import { GetUser } from 'src/common/decorators/get-current-user.decorator';

@Controller('deposit')
export class DepositController {
  constructor(private readonly depositService: DepositService) {}

  @Post('fund')
  @UseGuards(UserGuard)
  async transferFunds(@Body() depositFundsDto: DepositFundsDto, @GetUser() user: any): Promise<{ message: string }> {
    await this.depositService.fundAccount(user, depositFundsDto.amount);
    return { message: 'Funds Deposited successfully' };
  }

}
