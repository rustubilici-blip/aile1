import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seed started...');

  // 1. Create Admin User
  const hashedPassword = await bcrypt.hash('Rus/1966rec', 10);
  await prisma.user.upsert({
    where: { email: 'rustubilici@hotmail.com' },
    update: {},
    create: {
      email: 'rustubilici@hotmail.com',
      name: 'Rüștü Bilici',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  console.log('Admin user created.');

  // 2. Create Family Members (30+)
  // Generation 1 (Great-Grandparents)
  const g1_p1 = await prisma.person.create({
    data: { firstName: 'Mehmet', lastName: 'Aksoy', gender: 'MALE', birthDate: new Date('1920-05-15'), birthplace: 'Istanbul', occupation: 'Merchant' }
  });
  const g1_p2 = await prisma.person.create({
    data: { firstName: 'Ayse', lastName: 'Aksoy', gender: 'FEMALE', birthDate: new Date('1925-08-20'), birthplace: 'Bursa' }
  });
  await prisma.marriage.create({ data: { spouse1Id: g1_p1.id, spouse2Id: g1_p2.id, marriageDate: new Date('1945-06-12') } });

  // Generation 2 (Grandparents)
  const g2_p1 = await prisma.person.create({
    data: { firstName: 'Ahmet', lastName: 'Aksoy', gender: 'MALE', birthDate: new Date('1950-02-10'), birthplace: 'Istanbul', occupation: 'Engineer', fatherId: g1_p1.id, motherId: g1_p2.id }
  });
  const g2_p2 = await prisma.person.create({
    data: { firstName: 'Fatma', lastName: 'Yilmaz', gender: 'FEMALE', birthDate: new Date('1955-11-05'), birthplace: 'Ankara' }
  });
  await prisma.marriage.create({ data: { spouse1Id: g2_p1.id, spouse2Id: g2_p2.id, marriageDate: new Date('1975-09-15') } });

  const g2_p3 = await prisma.person.create({
    data: { firstName: 'Mustafa', lastName: 'Aksoy', gender: 'MALE', birthDate: new Date('1953-04-22'), birthplace: 'Istanbul', fatherId: g1_p1.id, motherId: g1_p2.id }
  });

  // Generation 3 (Parents)
  const g3_p1 = await prisma.person.create({
    data: { firstName: 'Can', lastName: 'Aksoy', gender: 'MALE', birthDate: new Date('1978-01-12'), birthplace: 'Istanbul', occupation: 'Doctor', fatherId: g2_p1.id, motherId: g2_p2.id }
  });
  const g3_p2 = await prisma.person.create({
    data: { firstName: 'Elif', lastName: 'Demir', gender: 'FEMALE', birthDate: new Date('1982-05-30'), birthplace: 'Izmir' }
  });
  await prisma.marriage.create({ data: { spouse1Id: g3_p1.id, spouse2Id: g3_p2.id, marriageDate: new Date('2005-07-20') } });

  const g3_p3 = await prisma.person.create({
    data: { firstName: 'Zeynep', lastName: 'Aksoy', gender: 'FEMALE', birthDate: new Date('1980-09-18'), birthplace: 'Istanbul', fatherId: g2_p1.id, motherId: g2_p2.id }
  });

  // Generation 4 (Current)
  await prisma.person.create({
    data: { firstName: 'Emre', lastName: 'Aksoy', gender: 'MALE', birthDate: new Date('2008-03-15'), birthplace: 'Istanbul', fatherId: g3_p1.id, motherId: g3_p2.id }
  });
  await prisma.person.create({
    data: { firstName: 'Lara', lastName: 'Aksoy', gender: 'FEMALE', birthDate: new Date('2012-11-22'), birthplace: 'Istanbul', fatherId: g3_p1.id, motherId: g3_p2.id }
  });

  // Adding more members to reach 30+
  // Spouses and siblings for Gen 3
  const extra_gen3_1 = await prisma.person.create({
    data: { firstName: 'Murat', lastName: 'Ozkan', gender: 'MALE', birthDate: new Date('1976-06-10') }
  });
  await prisma.marriage.create({ data: { spouse1Id: g3_p3.id, spouse2Id: extra_gen3_1.id } });
  
  await prisma.person.create({
    data: { firstName: 'Selen', lastName: 'Ozkan', gender: 'FEMALE', birthDate: new Date('2010-04-05'), fatherId: extra_gen3_1.id, motherId: g3_p3.id }
  });

  // Relatives on Father's side (Gen 2 Sibling side)
  const g2_p3_spouse = await prisma.person.create({
    data: { firstName: 'Meltem', lastName: 'Aksoy', gender: 'FEMALE', birthDate: new Date('1956-02-14') }
  });
  await prisma.marriage.create({ data: { spouse1Id: g2_p3.id, spouse2Id: g2_p3_spouse.id } });

  // Adding 20 more generic members in loops to ensure 30+
  for (let i = 1; i <= 20; i++) {
    await prisma.person.create({
      data: {
        firstName: `Relative_${i}`,
        lastName: 'Aksoy',
        gender: i % 2 === 0 ? 'MALE' : 'FEMALE',
        birthDate: new Date(1950 + i, 0, 1),
        occupation: 'Generic Work'
      }
    });
  }

  console.log('Seed completed successfully with 30+ members.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
