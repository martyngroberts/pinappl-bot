const getClient = require('./GraphQL/getClient')

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
    return results.telegramProcessLocation
}


module.exports = processChatLocation
