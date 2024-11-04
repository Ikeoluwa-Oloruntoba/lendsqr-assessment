import { BadRequestException, Injectable } from '@nestjs/common';
import { AdjutorIntegrationService } from 'src/integrations/adjutor/adjutor.integration';
import { UserRepository } from 'src/repository/knex/user.repository';
import { CreateUserDTO } from './dto/createUser.dto';
import { UpgradeKycDto } from './dto/upgrade-kyc.dto';
import { kycLevelMap } from 'src/common/constants/kyc-level.type';
import * as bcrypt from 'bcrypt';

@Injectable()
export class OnboardingService {

    constructor(
        private readonly userRepository: UserRepository,
        private readonly adjutorService: AdjutorIntegrationService // Injected repository to manage user data
      ) {}
    
    async createAccount(dto: CreateUserDTO) {

      const findUser = await this.userRepository.findByEmail(dto.email);
      if(findUser){
        throw new BadRequestException('User Already Exist');
      }
      // Check if user is in the Lendsqr Adjutor Karma blacklist
      const isBlacklisted = await this.adjutorService.checkKarmaList(dto.email);
  
      if (isBlacklisted) {
          throw new Error("User cannot be onboarded due to blacklist status.");
      }
  
      // Hash the user's password before storing it
      const hashedPassword = await bcrypt.hash(dto.password, 10); // 10 is the salt rounds
  
      // Create user with BASIC account tier and minimal KYC status
      const user = await this.userRepository.create({
          ...dto,
          password: hashedPassword, // Store the hashed password
          status: 'ACTIVE',
          kyc_status: 'NOT_VERIFIED',
          account_tier: 'BASIC', // Initial tier
      });
  
      return user;
    }

    async upgradeAccount(userId: string, data: UpgradeKycDto) {
      const user = await this.userRepository.findById(userId);
    
      if (!user) {
        throw new BadRequestException('User not found');
      }
    
      const { kycLevel, kycDocument } = data;
    
      // Check if the user is already on the requested KYC level
      if (user.account_tier === kycLevel) {
        throw new BadRequestException('You are already on this level');
      }
    
      const currentLevel = kycLevelMap[user.account_tier];
      const newLevel = kycLevelMap[kycLevel];
    
      // Prevent downgrade to a lower tier
      if (newLevel.priority < currentLevel.priority) {
        throw new BadRequestException('Downgrade to a lower tier is not allowed');
      }
    
      // Update user account tier and KYC status
      return this.userRepository.update(userId, {
        account_tier: newLevel.accountTier,
        kyc_status: newLevel.kycStatus,
        kyc_documents: kycDocument
      });
    }
}
