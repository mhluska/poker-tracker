## Poker Tracker

Frontend for a Google Sheet used to track my poker sessions.

To better understand how React works under the hood, I built my own [basic
React-like
library](https://github.com/mhluska/poker-tracker/tree/master/src/lib/renderer)
to power this.

### Develop

```sh
nvm use $(cat .nvmrc)
npm install
npm start
```

### Deploy

```sh
npm run deploy
```

### FAQ

> Why?

I used to type session data into a note on my phone and then
transfer it to the sheet later on my laptop. This was error-prone and got tiring
quickly.

> Why not use an existing poker app?

I wanted to be able to export the data and run my own queries on it.

> Why a custom React?

Curiosity.

> Can I use this?

Not yet. It only saves to my Google Sheet for now.
