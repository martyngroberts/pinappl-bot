# Pinappl Telegram

## Technology Stack

- **Frontend:**
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
