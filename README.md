## Poker Tracker Frontend

Extremely simple frontend for a Google Sheet I use to track my poker sessions.

I used to type session data into a note on my phone and then transfer it to
the sheet later on my laptop. This was error-prone and got tiring quickly.

### Develop

```sh
nvm use $(cat .nvmrc)
npm install
npm run build
npm start
```

### Deploy

```sh
npm run deploy
```

### Commands

- Start Session

Creates a poker session with the current time prefilled. Asks for the casino
name, stake, max buyin and max players. Max buyin and max players are prefilled
if entered previously. The URL is updated and session data is stored in
localStorage so the page can be refreshed.

- Rebuy

Asks for the amount to rebuy. Has a button for rebuying the maximum
automatically.

- End Session

Asks for cash out amount and prefills the end time with the current time. Asks
for the admin password which can be saved in a cookie for reuse later. A simple
form submit request is sent to simple backend service which adds a row to the
sheet after authenticating.

### TODO

- Add assets (og:image, favicon.icom, icon.svg, site.webmanifest, icon.png)
- Add opt-in notifications for when the session should be ended (x hours later)
