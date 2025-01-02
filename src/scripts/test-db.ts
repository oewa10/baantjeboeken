import { prisma } from '../lib/prisma'

async function main() {
  try {
    // Create a test club
    const club = await prisma.club.create({
      data: {
        name: 'Test Tennis Club',
        location: { lat: 52.3676, lng: 4.9041 }, // Amsterdam
        facilities: ['parking', 'restaurant'],
        courts: {
          create: [
            {
              name: 'Court 1',
              type: 'indoor',
              pricePerHour: 25.00,
            }
          ]
        }
      },
      include: {
        courts: true
      }
    })

    console.log('Successfully created club:', JSON.stringify(club, null, 2))

    // Verify we can read it back
    const clubs = await prisma.club.findMany({
      include: {
        courts: true
      }
    })

    console.log('\nAll clubs in database:', JSON.stringify(clubs, null, 2))

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
