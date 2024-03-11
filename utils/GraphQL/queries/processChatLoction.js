import getClient from '../getClient.js'

const processChatLocation = async (chatId, lat, lng) => {
  const gqlClient = getClient()
  const query = `
        mutation {
        telegramProcessLocation(chatId: "${chatId}", lat:"${lat}",lng:"${lng}") {
          prizeItemId
          eventName
          prizeName
          eventId
          userId
          wonDate
          claimed
          prizeCollectionLocation {
          lat,
          lng
          }
        }
        }
    `


  const results = await gqlClient.request(query)
  console.log(results, 'results')
  return results.telegramProcessLocation
}


export default processChatLocation
