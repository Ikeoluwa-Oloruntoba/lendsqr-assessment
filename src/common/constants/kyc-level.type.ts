export const kycLevelMap = {
    BASIC: { 
      accountTier: 'BASIC', 
      kycStatus: 'NOT_VERIFIED', 
      priority: 1, 
      depositLimit: 1000,       // Example limit for BASIC
      withdrawalLimit: 500      // Example limit for BASIC
    },
    SILVER: { 
      accountTier: 'SILVER', 
      kycStatus: 'PENDING', 
      priority: 2, 
      depositLimit: 5000,       // Example limit for SILVER
      withdrawalLimit: 2000     // Example limit for SILVER
    },
    GOLD: { 
      accountTier: 'GOLD', 
      kycStatus: 'VERIFIED', 
      priority: 3, 
      depositLimit: Infinity,   // Unlimited for GOLD
      withdrawalLimit: Infinity // Unlimited for GOLD
    },
  };
  