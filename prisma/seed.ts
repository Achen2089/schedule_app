import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedUsers() {
  // Seed Coaches
  const coachesData = [
    { name: 'Coach Johnson', phoneNumber: '1234567890', isCoach: true },
    { name: 'Coach Smith', phoneNumber: '1234567891', isCoach: true },
  ];

  for (const coachData of coachesData) {
    const coachExists = await prisma.user.findUnique({
      where: { phoneNumber: coachData.phoneNumber },
    });

    if (!coachExists) {
      await prisma.user.create({
        data: coachData,
      });
    }
  }

  // Seed Students
  const studentsData = [
    { name: 'Student Lee', phoneNumber: '0987654321', isCoach: false },
    { name: 'Student Kim', phoneNumber: '0987654322', isCoach: false },
  ];

  for (const studentData of studentsData) {
    const studentExists = await prisma.user.findUnique({
      where: { phoneNumber: studentData.phoneNumber },
    });

    if (!studentExists) {
      await prisma.user.create({
        data: studentData,
      });
    }
  }
}

async function seedAvailabilitySlots() {
  const coaches = await prisma.user.findMany({
    where: { isCoach: true },
  });

  for (const coach of coaches) {
    const slotsData = [
      {
        startTime: new Date(2024, 3, 5, 10, 0),
        endTime: new Date(2024, 3, 5, 12, 0),
        coachId: coach.id,
      },
      {
        startTime: new Date(2024, 3, 6, 14, 0),
        endTime: new Date(2024, 3, 6, 16, 0),
        coachId: coach.id,
      },
    ];

    for (const slotData of slotsData) {
      const slotExists = await prisma.availabilitySlot.findFirst({
        where: {
          AND: [
            { coachId: slotData.coachId },
            { startTime: slotData.startTime },
          ],
        },
      });

      if (!slotExists) {
        await prisma.availabilitySlot.create({
          data: slotData,
        });
      }
    }
  }
}

// Main seeding function
async function main() {
  console.log(`Start seeding...`);
  await seedUsers();
  await seedAvailabilitySlots();
  console.log(`Seeding finished.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
