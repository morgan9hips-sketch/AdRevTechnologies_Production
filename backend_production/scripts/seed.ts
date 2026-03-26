import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const prisma = new PrismaClient();

// Helper to hash data for privacy
const hashData = (data: string): string => {
  return crypto.createHash('sha256').update(data).digest('hex');
};

// Helper to generate unique watch key
const generateUniqueWatchKey = (): string => {
  return crypto.randomBytes(32).toString('hex');
};

async function main() {
  console.log('🌱 Seeding database...');
  await prisma.$connect();

  // Create admin user
  const adminPass = await bcrypt.hash('admin123', 10);

  // Check if admin user already exists
  const existingAdmin = await prisma.user.findFirst({
    where: { email: 'admin@cashforads.com' },
  });

  let admin;
  if (!existingAdmin) {
    admin = await prisma.user.create({
      data: {
        email: 'admin@cashforads.com',
        password: adminPass,
        name: 'Admin User',
        isAdmin: true,
        emailVerified: true,
        country: 'CA',
      },
    });
    console.log(`✅ Created admin user: ${admin.email}`);
  } else {
    admin = existingAdmin;
    console.log(`✅ Admin user already exists: ${admin.email}`);
  }

  await prisma.wallet.upsert({
    where: { userId: admin.id },
    update: {},
    create: { userId: admin.id, balanceCents: 0 },
  });

  // Create 50 regular users with wallets
  const users: any[] = [];
  for (let i = 1; i <= 50; i++) {
    const email = `user${i}@example.com`;
    const pass = await bcrypt.hash('password123', 10);

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: { email },
    });

    let user;
    if (!existingUser) {
      user = await prisma.user.create({
        data: {
          email,
          password: pass,
          name: `User ${i}`,
          country: 'CA',
          emailVerified: true,
        },
      });
    } else {
      user = existingUser;
    }

    // Give some users wallet balances
    const balance =
      i % 5 === 0 ? Math.floor(Math.random() * 5000) + 1000 : Math.floor(Math.random() * 500);
    await prisma.wallet.upsert({
      where: { userId: user.id },
      update: {},
      create: { userId: user.id, balanceCents: balance },
    });

    users.push(user);
  }
  console.log(`✅ Created 50 users with wallets`);

  // Create 20 ads with different providers
  const providers = ['AdMob', 'Unity Ads', 'ironSource', 'AppLovin', 'Vungle'];
  const ads: any[] = [];
  for (let i = 1; i <= 20; i++) {
    const ad = await prisma.ad.upsert({
      where: { id: i },
      update: {},
      create: {
        title: `Sample Ad ${i}`,
        description: `Watch this amazing ad and earn rewards! Ad #${i}`,
        provider: providers[i % providers.length],
        durationSeconds: [15, 30, 45][i % 3],
        rewardAmount: 10 + (i % 10) * 5, // 10-55 cents
        status: 'active',
        active: true,
      },
    });
    ads.push(ad);
  }
  console.log(`✅ Created 20 ads`);

  // Create 200 watch events with varied statuses
  let watchEventCount = 0;
  for (let i = 0; i < 200; i++) {
    const user = users[Math.floor(Math.random() * users.length)];
    const ad = ads[Math.floor(Math.random() * ads.length)];
    const uniqueWatchKey = generateUniqueWatchKey();
    const deviceId = `device_${user.id}_${Math.floor(Math.random() * 3)}`; // Simulate 3 devices per user
    const ip = `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;

    const statuses = ['pending', 'confirmed', 'confirmed', 'confirmed']; // More confirmed than pending
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const watchedSeconds = Math.min(
      ad.durationSeconds,
      Math.floor(Math.random() * ad.durationSeconds) + ad.durationSeconds * 0.7
    );

    const watchEvent = await prisma.watchEvent.create({
      data: {
        adId: ad.id,
        userId: user.id,
        watchedSeconds: Math.floor(watchedSeconds),
        status,
        uniqueWatchKey,
        confirmedAt:
          status === 'confirmed'
            ? new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
            : null,
        deviceId,
        ip,
        userAgent: 'Mozilla/5.0 (compatible; SeedScript/1.0)',
        createdAt: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000), // Last 60 days
      },
    });

    // Create ledger entry for confirmed watches
    if (status === 'confirmed' && watchEvent.confirmedAt) {
      const grossReward = Math.floor(ad.rewardAmount * (watchedSeconds / ad.durationSeconds));
      const platformFee = Math.floor(grossReward * 0.1);
      const netReward = grossReward - platformFee;

      const wallet = await prisma.wallet.findUnique({ where: { userId: user.id } });
      if (wallet) {
        const newBalance = wallet.balanceCents + netReward;

        await prisma.wallet.update({
          where: { userId: user.id },
          data: { balanceCents: newBalance },
        });

        await prisma.ledgerEntry.create({
          data: {
            userId: user.id,
            amountCents: netReward,
            balanceAfter: newBalance,
            type: 'credit',
            reference: `watch_${watchEvent.id}`,
            feeCents: platformFee,
            metadata: {
              eventType: 'watch',
              eventId: watchEvent.id,
              adId: ad.id,
              grossAmount: grossReward,
            },
            createdAt: watchEvent.confirmedAt,
          },
        });

        // Platform fee entry
        await prisma.ledgerEntry.create({
          data: {
            userId: 0, // Platform account
            amountCents: platformFee,
            type: 'platform_fee',
            reference: `watch_${watchEvent.id}`,
            feeCents: 0,
            metadata: {
              sourceUserId: user.id,
              eventType: 'watch',
              eventId: watchEvent.id,
            },
            createdAt: watchEvent.confirmedAt,
          },
        });
      }
    }

    watchEventCount++;
  }
  console.log(`✅ Created ${watchEventCount} watch events with ledger entries`);

  // Create some ad network events
  for (let i = 0; i < 50; i++) {
    const ad = ads[Math.floor(Math.random() * ads.length)];
    await prisma.adNetworkEvent.create({
      data: {
        adId: ad.id,
        network: ad.provider || 'Unknown',
        eventType: ['impression', 'click', 'reward'][Math.floor(Math.random() * 3)],
        eventId: `evt_${Date.now()}_${i}`,
        revenueCents: Math.floor(Math.random() * 100),
        rawPayload: {
          timestamp: new Date().toISOString(),
          source: 'seed_script',
        },
      },
    });
  }
  console.log(`✅ Created 50 ad network events`);

  // Create some device fingerprints
  for (let i = 0; i < 100; i++) {
    const user = users[Math.floor(Math.random() * users.length)];
    const deviceId = `device_${user.id}_${Math.floor(Math.random() * 3)}`;
    const ip = `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;

    await prisma.deviceFingerprint.upsert({
      where: { deviceId },
      update: {
        lastSeenAt: new Date(),
      },
      create: {
        userId: user.id,
        deviceId,
        ipHash: hashData(ip),
        userAgentHash: hashData('Mozilla/5.0 (compatible; SeedScript/1.0)'),
      },
    });
  }
  console.log(`✅ Created device fingerprints`);

  // Create some fraud flags (simulated)
  for (let i = 0; i < 10; i++) {
    const user = users[Math.floor(Math.random() * users.length)];
    await prisma.fraudFlag.create({
      data: {
        entityType: 'user',
        entityId: user.id.toString(),
        reason: ['Duplicate IP', 'Velocity exceeded', 'Multiple devices', 'Suspicious pattern'][
          i % 4
        ],
        score: Math.floor(Math.random() * 50) + 30, // 30-80
        status: i % 3 === 0 ? 'reviewed' : 'pending',
        reviewedBy: i % 3 === 0 ? admin.id : null,
        reviewedAt: i % 3 === 0 ? new Date() : null,
      },
    });
  }
  console.log(`✅ Created fraud flags`);

  // Create a sample payout batch
  const eligibleUsers = users.slice(0, 10); // First 10 users
  let totalPayout = 0;
  for (const user of eligibleUsers) {
    const wallet = await prisma.wallet.findUnique({ where: { userId: user.id } });
    if (wallet) totalPayout += wallet.balanceCents;
  }

  if (totalPayout > 0) {
    const batch = await prisma.payoutBatch.create({
      data: {
        createdByAdminId: admin.id,
        totalAmountCents: totalPayout,
        platformFeeCents: 0,
        status: 'pending',
      },
    });

    for (const user of eligibleUsers) {
      const wallet = await prisma.wallet.findUnique({ where: { userId: user.id } });
      if (wallet && wallet.balanceCents > 0) {
        await prisma.payoutItem.create({
          data: {
            batchId: batch.id,
            userId: user.id,
            recipientIdentifier: user.email,
            amountCents: wallet.balanceCents,
            status: 'pending',
          },
        });
      }
    }
    console.log(`✅ Created sample payout batch with ${eligibleUsers.length} items`);
  }

  // Create offer conversions
  for (let i = 0; i < 20; i++) {
    const user = users[Math.floor(Math.random() * users.length)];
    await prisma.offerConversion.create({
      data: {
        userId: user.id,
        offerId: `offer_${i + 1}`,
        offerName: `Sample Offer ${i + 1}`,
        network: 'OfferToro',
        status: ['pending', 'confirmed', 'confirmed'][Math.floor(Math.random() * 3)],
        rewardCents: 50 + Math.floor(Math.random() * 200),
        payoutCents: 45 + Math.floor(Math.random() * 180),
        networkEventId: `conv_${Date.now()}_${i}`,
        confirmedAt: Math.random() > 0.5 ? new Date() : null,
      },
    });
  }
  console.log(`✅ Created 20 offer conversions`);

  // Create 15 demo users for leaderboard motivation
  const demoUsersData = [
    // Diamond Tier (3 users)
    { username: 'CashKing_Demo', totalEarnings: 125000, tier: 'Diamond', adsWatched: 2100 },
    { username: 'AdMaster_Demo', totalEarnings: 118500, tier: 'Diamond', adsWatched: 1950 },
    { username: 'EarnQueen_Demo', totalEarnings: 105000, tier: 'Diamond', adsWatched: 1800 },
    // Platinum Tier (3 users)
    { username: 'PlatinumPro_Demo', totalEarnings: 78000, tier: 'Platinum', adsWatched: 1350 },
    { username: 'MoneyMaker_Demo', totalEarnings: 65000, tier: 'Platinum', adsWatched: 1100 },
    { username: 'CashFlow_Demo', totalEarnings: 52000, tier: 'Platinum', adsWatched: 950 },
    // Gold Tier (4 users)
    { username: 'GoldRush_Demo', totalEarnings: 42000, tier: 'Gold', adsWatched: 780 },
    { username: 'AdWatcher_Demo', totalEarnings: 35000, tier: 'Gold', adsWatched: 650 },
    { username: 'EarnGold_Demo', totalEarnings: 28000, tier: 'Gold', adsWatched: 520 },
    { username: 'CashGold_Demo', totalEarnings: 18000, tier: 'Gold', adsWatched: 380 },
    // Silver Tier (3 users)
    { username: 'SilverStar_Demo', totalEarnings: 12000, tier: 'Silver', adsWatched: 280 },
    { username: 'AdSilver_Demo', totalEarnings: 8500, tier: 'Silver', adsWatched: 180 },
    { username: 'QuickSilver_Demo', totalEarnings: 6000, tier: 'Silver', adsWatched: 120 },
    // Bronze Tier (2 users)
    { username: 'BronzeStart_Demo', totalEarnings: 3500, tier: 'Bronze', adsWatched: 75 },
    { username: 'NewEarner_Demo', totalEarnings: 1200, tier: 'Bronze', adsWatched: 25 },
  ];

  for (const demoData of demoUsersData) {
    await prisma.demoUser.upsert({
      where: { username: demoData.username },
      update: {},
      create: demoData,
    });
  }
  console.log(`✅ Created 15 demo users for leaderboard`);

  console.log('\n🎉 Seed complete!');
  console.log('\n📊 Summary:');
  console.log(`  - 1 admin user (admin@cashforads.com / admin123)`);
  console.log(`  - 50 regular users (user1@example.com / password123, etc.)`);
  console.log(`  - 20 ads across 5 providers`);
  console.log(`  - 200 watch events (mixed pending/confirmed)`);
  console.log(`  - Ledger entries for confirmed watches`);
  console.log(`  - 50 ad network events`);
  console.log(`  - Device fingerprints`);
  console.log(`  - 10 fraud flags`);
  console.log(`  - 1 sample payout batch`);
  console.log(`  - 20 offer conversions`);
  console.log(`  - 15 demo users for leaderboard`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
