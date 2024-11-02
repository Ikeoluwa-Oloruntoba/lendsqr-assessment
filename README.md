# Demo Credit Wallet MVP

This project provides a wallet microservice for Demo Credit, a mobile lending app. The wallet MVP includes account creation, deposit, withdrawal, and fund transfer functionalities with security and data consistency through Redis-based distributed locking.

## Features

- **User Wallet Account Creation**: Onboards users based on KYC verification.
- **Wallet Transactions**: Supports deposits, withdrawals, and transfers between user accounts.
- **Transaction Snapshotting**: Efficiently calculates balance by storing periodic snapshots.
- **KYC-Based Transaction Limits**: Users have transaction limits based on their KYC level.
- **Distributed Locking with Redis**: Prevents race conditions during concurrent operations.
- **Blacklist Verification**: Checks Lendsqr Adjutor Karma list for user onboarding.

## Prerequisites

- Node.js (Latest recommended)
- Redis
- MySQL

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-repo/demo-credit-wallet.git
   cd demo-credit-wallet
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**: Copy `.env.example` to `.env` and configure the following:
   ```plaintext
   DATABASE_URL=mysql://user:password@localhost:3306/demo_credit
   REDIS_URL=redis://localhost:6379
   ADJUTOR_API_URL=https://adjutor.lendsqr.com/v2
   ```

4. **Run Migrations**:
   ```bash
    npx knex migrate:latest
   ```

5. **Start the Application**:
   ```bash
   npm run start
   ```

## Modules and Services

### 1. **User Onboarding and KYC Verification**

The `OnboardingService` handles user registration with verification against the Lendsqr Adjutor Karma list. Users on the blacklist cannot be onboarded.

```typescript
async createAccount(dto: CreateUserDTO) {
  const isBlacklisted = await this.adjutorService.checkKarmaList(dto.email);
  if (isBlacklisted) {
    throw new Error("User cannot be onboarded due to blacklist status.");
  }
  return this.userRepository.create({
    ...dto,
    status: 'ACTIVE',
    kyc_status: 'NOT_VERIFIED',
    account_tier: 'BASIC',
  });
}
```

### 2. **Wallet Service**

- **Transaction Operations**: Implements `deposit`, `withdraw`, and `transfer` methods.
- **Distributed Locking with Redis**: Prevents race conditions using `Redlock` during transactions.
  
   Example for `deposit` method with Redis lock:

   ```typescript
   async deposit(userId: string, amount: number): Promise<void> {
     const lockKey = `wallet:lock:${userId}`;
     const lock = await this.redlock.acquire([lockKey], this.lockTTL);
     try {
       // Perform deposit logic here...
     } finally {
       await this.redlock.release(lock);
     }
   }
   ```

### 3. **Snapshot Repository**

This repository uses periodic snapshots to efficiently compute user balances, optimizing the retrieval of transaction history.

```typescript
async computeBalance(userId: string): Promise<number> {
  const lastSnapshot = await this.snapshotsRepository.getLastSnapshot(userId);
  const balance = lastSnapshot ? lastSnapshot.balance : 0;

  const transactions = await this.transactionsRepository.getUserTransactionsSinceSnapshot(
    userId,
    lastSnapshot ? lastSnapshot.id : null,
  );

  return transactions.reduce((acc, tx) => acc + (tx.type === 'CREDIT' ? tx.amount : -tx.amount), balance);
}
```

### 4. **Adjutor Integration Helper**

A helper service to verify users against the Lendsqr Adjutor Karma list before onboarding.

```typescript
async checkKarmaList(identity: string): Promise<boolean> {
  try {
    const response = await this.axiosInstance.get(`/karma/${identity}`);
    return response.data?.blacklisted === true;
  } catch (error) {
    throw new HttpException('Error connecting to Adjutor API', HttpStatus.SERVICE_UNAVAILABLE);
  }
}
```

## DTOs

DTOs are used across services to enforce the shape of data for consistent data validation and formatting:

- **CreateUserDTO**: For onboarding new users.
- **UpgradeKycDto**: For handling account upgrades.

## Usage

### 1. **Create a New Account**

```typescript
POST /auth/register
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

### 2. **Deposit Funds**

```typescript
POST /wallet/deposit
{
  "amount": 1000
}
```

### 3. **Transfer Funds**

```typescript
POST /wallet/transfer
{
  "toUserId": "recipient-id",
  "amount": 500
}
```

### 4. **Withdraw Funds**

```typescript
POST /wallet/withdraw
{
  "amount": 300
}
```

## Testing

Run tests for the wallet service and repository methods:

```bash
npm run test
```

## Future Improvements

- **Further Enhancements to Snapshot Frequency**: Configurable snapshot frequencies for high-transaction users.
- **Extended KYC Levels and Limits**: More flexible deposit and withdrawal limits based on user KYC tier.
- **Scalability Improvements**: Implement horizontal scaling with Redis Cluster.
