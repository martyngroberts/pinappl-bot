import getClient from '../getClient.js'

const claimPrize = async (chatId) => {
    const gqlClient = getClient()
    const query = `
        mutation {
        telegramClaimPrize(chatId: "${chatId}")
        }
    `


    const results = await gqlClient.request(query)
    return results.telegramClaimPrize
}

export default claimPrize
