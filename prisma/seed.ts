import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create test clubs
  const club1 = await prisma.club.create({
    data: {
      name: 'Padel Club Amsterdam',
      location: { lat: 52.3676, lng: 4.9041 },
      facilities: ['parking', 'restaurant', 'showers'],
      bookingUrl: 'https://padelamsterdam.com/booking',
      courts: {
        create: [
          {
            name: 'Court 1',
            type: 'indoor',
            pricePerHour: 40.00,
            availability: {
              create: [
                {
                  startTime: new Date('2024-01-01T09:00:00Z'),
                  endTime: new Date('2024-01-01T10:00:00Z'),
                  status: 'available'
                },
                {
                  startTime: new Date('2024-01-01T10:00:00Z'),
                  endTime: new Date('2024-01-01T11:00:00Z'),
                  status: 'available'
                }
              ]
            }
          },
          {
            name: 'Court 2',
            type: 'outdoor',
            pricePerHour: 35.00,
            availability: {
              create: [
                {
                  startTime: new Date('2024-01-01T09:00:00Z'),
                  endTime: new Date('2024-01-01T10:00:00Z'),
                  status: 'available'
                }
              ]
            }
          }
        ]
      }
    }
  })

  const club2 = await prisma.club.create({
    data: {
      name: 'Rotterdam Padel Center',
      location: { lat: 51.9225, lng: 4.4792 },
      facilities: ['parking', 'pro-shop', 'cafe'],
      bookingUrl: 'https://rotterdampadel.com/booking',
      courts: {
        create: [
          {
            name: 'Center Court',
            type: 'indoor',
            pricePerHour: 45.00,
            availability: {
              create: [
                {
                  startTime: new Date('2024-01-01T14:00:00Z'),
                  endTime: new Date('2024-01-01T15:00:00Z'),
                  status: 'available'
                }
              ]
            }
          },
          {
            name: 'Court B',
            type: 'indoor',
            pricePerHour: 42.00,
            availability: {
              create: [
                {
                  startTime: new Date('2024-01-01T15:00:00Z'),
                  endTime: new Date('2024-01-01T16:00:00Z'),
                  status: 'available'
                }
              ]
            }
          }
        ]
      }
    }
  })

  console.log('Seed data created:', { club1, club2 })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
