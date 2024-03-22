# Pinappl Telegram

## Technology Stack

- **Backend:**
  - dotenv: Environment variable management
  - graphql: Data query and manipulation language for APIs
  - graphql-request: Minimal GraphQL client
  - node-telegram-bot-api: Platform for building Telegram Bots

## Local Installation

Follow the instructions below to set up and run this project locally on your machine.

### Cloning Repo and Starting the Server

1. **Clone the Repository:**

```bash
git clone https://github.com/martyngroberts/pinappl-bot.git && code pinappl-bot/
```

2. **Install Dependencies:**

```bash
bun install
```

3. **Set Env Variables:**

Create a .env file and add the following variables:
```bash
API_ENDPOINT=http://localhost:5000/pinappl-dev/europe-west3/api/graphql
BOT_TOKEN=*
```

4. **Run the starter site locally:**

```bash
bun start
```

5. **Obtain personal chatId:**

Naviagte to [Netlify Logs](https://app.netlify.com/sites/pinappl-bot/logs/functions/runtime), send a message to the bot through [Telegram](https://t.me/Pinnaplbot
) and save your chatId for successful interaction in development

You can now interact with the bot at [http://localhost:8888/.netlify/functions/runtime](http://localhost:8888/.netlify/functions/runtime) using an ADE like [Postman](https://www.postman.com/)

Here is an exmaple of what the request body should look like in PostMan:
  ```bash
{
    "update_id": 381423972,
        "message": {
        "message_id": 83,
            "from": {
            "id": Find in Netlify Logs,
                "is_bot": false,
                    "first_name": "Str",
                        "last_name": "Str",
                            "language_code": "en"
        },
        "chat": {
            "id": Find in Netlify Logs,
                "first_name": "Str",
                    "last_name": "Str",
                        "type": "private"
        },
        "date": 1710338470,
            "text": "/help",
                "location": {
            "latitude": Int,
                "longitude": -Int,
                    "live_period": 3599,
                        "heading": 212,
                            "horizontal_accuracy": 6.000000
        }
    }
}
  ```

6. **Resetting the WebHook**


If you need to reset the webhook, this is the command structure:

```bash
curl -F "url=https://bot.pinappl.com/.netlify/functions/runtime" https://api.telegram.org/bot<bot token>/setWebhook
```
