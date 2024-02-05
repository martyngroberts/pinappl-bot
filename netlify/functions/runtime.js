const dotenv = require('dotenv')
dotenv.config()

const axios = require('axios')
const processChatLocation = require('../../utils/processChatLoction')
const claimPrize = require('../../utils/claimPrize')
const getUnclaimedPrize = require('../../utils/getUnclaimedPrize')

const BOT_TOKEN = process.env.BOT_TOKEN
const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}`

const userStates = {}

const initUserState = (chatId) => {
    if (!userStates[chatId]) {
        userStates[chatId] = { state: 'pending', tracking: false }
    }
}

const sendMessage = async (chatId, text, options = {}) => {
    const url = `${TELEGRAM_API}/sendMessage`
    await axios.post(url, {
        chat_id: chatId,
        text,
        ...options
    })
}

const sendLocation = async (chatId, latitude, longitude) => {
    const url = `${TELEGRAM_API}/sendLocation`
    await axios.post(url, {
        chat_id: chatId,
        latitude,
        longitude
    })
}

exports.handler = async (event) => {
    const { message, edited_message } = JSON.parse(event.body)
    const msg = message || edited_message

    if (!msg) {
        return { statusCode: 200, body: 'No message' }
    }

    const chatId = msg.chat.id
    initUserState(chatId)

    // Handling Location Updates
    if (msg.location && msg.location?.live_period) {
        userStates[chatId].tracking = true
        console.log('checking location')

        try {
            const prize = await processChatLocation(chatId, msg.location.latitude, msg.location.longitude)
            await sendMessage(chatId, `Congrats! You have won the following prize! ${prize.prizeName}`)
            await sendMessage(chatId, 'To claim your prize, visit the collection area located at the directions below!')
            await sendLocation(chatId, prize.prizeCollectionLocation.lat, prize.prizeCollectionLocation.lng)
            await sendMessage(chatId, 'Once you have found it, speak to the representative and type /claim to receive your prize!')
        } catch (_) {
            console.log('prize not won')
        }
    } else if (msg.location && !msg.location?.live_period) {
        console.log('location not live')
        userStates[chatId].tracking = false
        await sendMessage(chatId, "We're no longer tracking your location, feel free to share your live location with us for the chance to stumble across prizes!")
    }

    // Handling Text Commands
    if (msg.text) {
        await handleTextCommands(chatId, msg.text)
    }

    return { statusCode: 200, body: 'Command processed' }
}

const handleTextCommands = async (chatId, text) => {
    const command = text.toLowerCase()

    switch (command) {
        case '/help':
            const helpText = `
                Here are some commands you can type at any time to help you along the way!
                /myprize - View what prize you have won and should claim.
                /pickup - View the location of where you can pick up your prize.
                /claim - Confirm claiming and receiving your prize.
            `
            await sendMessage(chatId, helpText)
            break
        case '/claim':
            await handleClaim(chatId)
            break
        case '/pickup':
            await handlePickup(chatId)
            break
        case '/myprize':
            await handleMyPrize(chatId)
            break
        case 'confirm':
            await handleConfirm(chatId)
            break
        case 'cancel':
            await handleCancel(chatId)
            break
        default:
            if(!userStates[chatId]) {
                await sendMessage(chatId, "Hey welcome to Pinappl!")
                await sendMessage(chatId, "To start, all you have to do is share your live location with us, and we'll alert you if you stumble across a prize! \nFor a list of commands you can always type /help")

                break
            } else {
                await sendMessage(chatId, "Sorry, I didn't understand that command. Try typing /help to see the available list of commands.")
                break
            }
    }
}

const handleClaim = async (chatId) => {
    try {
        const unclaimedPrize = await getUnclaimedPrize(chatId)
        userStates[chatId].state = 'claim'
        await sendMessage(chatId, `Prize time! Please confirm that you have found the representative at the pickup area and received the following prize: \n\n${unclaimedPrize.prizeName}`)
        await sendMessage(chatId, "Please note that confirming before receiving your prize may affect your ability to claim your prize.")
    } catch (_) {
        await sendMessage(chatId, "Looks like you don't have any prizes to claim at this point. Keep sharing your location and we'll notify you if you stumble across any prizes!")
    }
}

const handlePickup = async (chatId) => {
    try {
        const unclaimedPrize = await getUnclaimedPrize(chatId)
        await sendMessage(chatId, 'Below is where you\'ll find the pickup location!')
        await sendLocation(chatId, unclaimedPrize.prizeCollectionLocation.lat, unclaimedPrize.prizeCollectionLocation.lng)
        await sendMessage(chatId, 'Once you have found it and received your prize, type /claim to claim your prize ')
    } catch (_) {
        await sendMessage(chatId, "No pickup information available at the moment.")
    }
}

const handleMyPrize = async (chatId) => {
    try {
        const unclaimedPrize = await getUnclaimedPrize(chatId)
        await sendMessage(chatId, `Congrats! You currently are able to claim the following prize: \n\n${unclaimedPrize.prizeName}`)
    } catch (_) {
        await sendMessage(chatId, "You don't have any prizes to claim at this point.")
    }
}

const handleConfirm = async (chatId) => {
    if (userStates[chatId].state === 'claim') {
        try {
            await claimPrize(chatId)
            userStates[chatId].state = 'pending'
            await sendMessage(chatId, "Congrats on claiming your prize! You can now continue sharing your location to find more prizes!")
        } catch (err) {
            console.log(err)
        }
    }
}

const handleCancel = async (chatId) => {
    if (userStates[chatId].state === 'claim') {
        userStates[chatId].state = 'pending'
        await sendMessage(chatId, "No worries! Once you have found the pickup location and spoken to the representative, type /claim after receiving your prize! \n \n If you need help finding the pickup location, type /pickup")
    } else {
        await sendMessage(chatId, "You don't have any prizes to cancel at this point.")
    }
}
