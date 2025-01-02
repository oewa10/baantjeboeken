import { prisma } from '../lib/prisma'

async function main() {
  try {
    // Create a test club
    const club = await prisma.club.create({
      data: {
        name: 'Padel Club Amsterdam',
        location: { lat: 52.3676, lng: 4.9041 },
        facilities: ['parking', 'restaurant', 'showers', 'lockers'],
        bookingUrl: 'https://example.com/book',
        courts: {
          create: [
            {
              name: 'Court 1',
              type: 'indoor',
              pricePerHour: 25.00,
              availability: {
                create: [
                  {
                    startTime: new Date('2024-12-31T09:00:00Z'),
                    endTime: new Date('2024-12-31T10:00:00Z'),
                    status: 'available'
                  },
                  {
                    startTime: new Date('2024-12-31T10:00:00Z'),
                    endTime: new Date('2024-12-31T11:00:00Z'),
                    status: 'available'
                  },
                  {
                    startTime: new Date('2024-12-31T11:00:00Z'),
                    endTime: new Date('2024-12-31T12:00:00Z'),
                    status: 'booked'
                  }
                ]
              }
            },
            {
              name: 'Court 2',
              type: 'outdoor',
              pricePerHour: 20.00,
              availability: {
                create: [
                  {
                    startTime: new Date('2024-12-31T09:00:00Z'),
                    endTime: new Date('2024-12-31T10:00:00Z'),
                    status: 'available'
                  },
                  {
                    startTime: new Date('2024-12-31T10:00:00Z'),
                    endTime: new Date('2024-12-31T11:00:00Z'),
                    status: 'available'
                  }
                ]
              }
            }
          ]
        }
      },
      include: {
        courts: {
          include: {
            availability: true
          }
        }
      }
    })

    console.log('Test data created successfully!')
    console.log('Club created:', club.name)
    console.log('Courts created:', club.courts.length)
    console.log('\nYou can now visit:')
    console.log('1. Courts listing page: http://localhost:3000/courts')
    console.log(`2. Court detail page: http://localhost:3000/courts/${club.courts[0].id}`)

  } catch (error) {
    console.error('Error seeding data:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
