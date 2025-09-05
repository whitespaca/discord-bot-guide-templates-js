# discord-bot-guide-templates-js

## Getting Started

1. install [node.js](https://nodejs.org/dist/v22.19.0/node-v22.19.0-x64.msi)

2. install latest [discord.js](https://discord.js.org/#/docs/discord.js/main/general/welcome) version

    - `win` + `R`
    - type `cmd` and enter
    - type

    ```powershell
    npm install discord.js
    ```

    - wait until finished

3. create bot on [discord developer portal](https://discord.com/developers/applications)

4. copy bot token

5. create new folder for your bot

6. create new file `index.js` in your bot folder

## How to run

1. open terminal in your bot folder

2. type

    ```powershell
    node index.js
    ```

3. if you see `Logged in as <your bot name>!` your bot is online

## templates

- [pingpong.js](./templates/pingpong.js) - simple ping pong bot
- [embed.js](./templates/embed.js) - bot that sends embed message
- [myprofileinfo.js](./templates/myprofileinfo.js) - bot that sends your profile info
- [slashcommand.js](./templates/slashcommand.js) - bot that uses slash commands
- [reactionrole.js](./templates/reactionrole.js) - bot that gives role on reaction
- [reactionrolebutton.js](./templates/reactionrolebutton.js) - bot that gives role on button click
