import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { WithdrawalService } from './withdrawal.service';
import { TransferFundsDto } from './dto/transfer.dto';
import { WithdrawFundsDto } from './dto/withdrawal.dto';
import { UserGuard } from 'src/common/guards/user.guard';
import { GetUser } from 'src/common/decorators/get-current-user.decorator';

@Controller('wallet')
export class WithdrawalController {
  constructor(private readonly withdrawalService: WithdrawalService) {}

  
  @Post('transfer')
  @UseGuards(UserGuard)
  async transferFunds(@Body() transferFundsDto: TransferFundsDto, @GetUser() user: any): Promise<{ message: string }> {
    await this.withdrawalService.transferFunds(user, transferFundsDto);
    return { message: 'Funds transferred successfully' };
  }

  @Post('withdraw')
  @UseGuards(UserGuard)
  async withdrawFunds(@Body() withdrawFundsDto: WithdrawFundsDto, @GetUser() user: any): Promise<{ message: string }> {
    await this.withdrawalService.withdrawFunds(user, withdrawFundsDto);
    return { message: 'Withdrawal successful' };
  }
}
