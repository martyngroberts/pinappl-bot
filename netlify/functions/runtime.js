const axios = require('axios');
const processChatLocation = require('../../utils/processChatLoction');
const claimPrize = require('../../utils/claimPrize');
const getUnclaimedPrize = require('../../utils/getUnclaimedPrize');

const BOT_TOKEN = process.env.BOT_TOKEN;
const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}`;

const sendMessage = async (chatId, text) => {
  const url = `${TELEGRAM_API}/sendMessage`;
  await axios.post(url, {
    chat_id: chatId,
    text
  });
};

const sendLocation = async (chatId, latitude, longitude) => {
  const url = `${TELEGRAM_API}/sendLocation`;
  await axios.post(url, {
    chat_id: chatId,
    latitude,
    longitude
  });
};

exports.handler = async (event) => {
  try {
    const { message, edited_message } = JSON.parse(event.body);
    const msg = message || edited_message;

    if (!msg) {
      return { statusCode: 200, body: 'No message' };
    }

    const chatId = msg.chat.id;

    // Process location updates
    if (msg.location && msg.location.live_period) {
      const prize = await processChatLocation(chatId, msg.location.latitude, msg.location.longitude);
      if (prize) {
        await sendMessage(chatId, `Congrats! You have won the following prize! ${prize.prizeName}`);
        await sendMessage(chatId, 'To claim your prize, visit the collection area located at the directions below!');
        await sendLocation(chatId, prize.prizeCollectionLocation.lat, prize.prizeCollectionLocation.lng);
        await sendMessage(chatId, 'Once you have found it, speak to the representative and type /claim to receive your prize!');
      } else {
        await sendMessage(chatId, 'No prize found at this location. Keep exploring!');
      }
    } else if (msg.text) {
      const command = msg.text.toLowerCase();

      switch (true) {
        case command.startsWith('/claim'):
          const unclaimedPrize = await getUnclaimedPrize(chatId);
          if (unclaimedPrize) {
            await sendMessage(chatId, `Prize time! Please confirm that you have found the representative at the pickup area and received the following prize: \n\n${unclaimedPrize.prizeName}`);
          } else {
            await sendMessage(chatId, "Looks like you don't have any prizes to claim at this point. Keep sharing your location and we'll notify you if you stumble across any prizes!");
          }
          break;
        case command.startsWith('/myprize'):
          const prizeInfo = await getUnclaimedPrize(chatId);
          if (prizeInfo) {
            await sendMessage(chatId, `Congrats! You currently are able to claim the following prize: \n\n${prizeInfo.prizeName}`);
          } else {
            await sendMessage(chatId, "You don't have any prizes to claim at this point.");
          }
          break;
        case command.startsWith('/pickup'):
          const pickupInfo = await getUnclaimedPrize(chatId);
          if (pickupInfo) {
            await sendMessage(chatId, 'Below is where you\'ll find the pickup location!');
            await sendLocation(chatId, pickupInfo.prizeCollectionLocation.lat, pickupInfo.prizeCollectionLocation.lng);
            await sendMessage(chatId, 'Once you have found it and received your prize, type /claim to claim your prize ');
          } else {
            await sendMessage(chatId, "No pickup information available at the moment.");
          }
          break;
        case command === 'confirm':
          await claimPrize(chatId);
          await sendMessage(chatId, "Congrats on claiming your prize! You can now continue sharing your location to find more prizes!");
          break;
        default:
          await sendMessage(chatId, "Sorry, I didn't understand that command.");
      }
    }

    return { statusCode: 200, body: 'Command processed' };
  } catch (error) {
    console.error('Error processing the event:', error);
    return { statusCode: 500, body: 'Internal Server Error' };
  }
};
