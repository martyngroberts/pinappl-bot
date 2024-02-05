import getClient from '../getClient.js'

const claimPrize = async (chatId) => {
  const gqlClient = getClient()
  const query = `
        query {
        telegramGetUnclaimedPrize(chatId: "${chatId}")
        {
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
  return results.telegramGetUnclaimedPrize
}


export default claimPrize
