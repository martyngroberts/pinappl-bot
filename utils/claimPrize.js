const getClient = require('../utils/GraphQL/getClient')

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


module.exports = claimPrize
