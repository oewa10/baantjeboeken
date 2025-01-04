let distanceMatrixService: google.maps.DistanceMatrixService | null = null

export async function calculateDistance(from: string, to: string): Promise<number> {
  if (!distanceMatrixService) {
    distanceMatrixService = new google.maps.DistanceMatrixService()
  }

  try {
    const response = await distanceMatrixService.getDistanceMatrix({
      origins: [from],
      destinations: [to],
      travelMode: google.maps.TravelMode.DRIVING,
      unitSystem: google.maps.UnitSystem.METRIC
    })

    if (response.rows[0]?.elements[0]?.distance?.value) {
      // Convert meters to kilometers
      return response.rows[0].elements[0].distance.value / 1000
    }

    return Infinity // Return Infinity if no route found
  } catch (error) {
    console.error('Error calculating distance:', error)
    return Infinity // Return Infinity on error
  }
}
