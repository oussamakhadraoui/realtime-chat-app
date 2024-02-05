

## Real Time Chat App
creating an chat app with a realtime rendering with pusher
it was a really hard project because the documentation of pusher was really hard to understand espacially in the none use of the : symbol

Key Features:
- 🔐 Next auth
- 🛂 Realtime messaging
- 💻 Pusher RealTime
- 📱  Redis caching
- 🚀 Adding friends and sending friend requests via email
- 🌐 Performant database queries with Redis
- 🔔 Responsive UI built with TailwindCSS
- 🔓 Protection of sensitive routes
- 🔐 Google authentication
- ⚠️ Error component
- 🔘 Login button
- 🚪 Logout button
- 👑 Built with TypeScript
- 📈 TailwindCSS
- 📱  Icons from Lucide
- 📝 Class merging with tailwind-merge
- 🤔 Conditional classes with clsx
- 💻 Variants with class-variance-authority


### Prerequisites

**Node version 18.7.x**

### Cloning the repository

```shell
git clone https://github.com/oussamakhadraoui/realtime-chat-app.git
```

### Install packages

```shell
npm i
```

### Setup .env file



- NEXTAUTH_SECRET= "here you need to write a very powerful secret u can use a sha256 generator "

- UPSTASH_REDIS_REST_URL=

- UPSTASH_REDIS_REST_TOKEN=

  go to https://console.upstash.com/ and generate an URL and TOKEN

- GOOGLE_CLIENT_ID=
  
- GOOGLE_CLIENT_SECRET=

  You can go to the google console and generate a new identification

- PUSHER_ID=
  
- PUSHER_SECRET=
  
- NEXT_PUBLIC_PUSHER_APP_KEY=

  go to https://dashboard.pusher.com/ and generate the above env




### Start the app

```shell
npm run dev
```

## Available commands

Running commands with npm `npm run [command]`

| command         | description                              |
| :-------------- | :--------------------------------------- |
| `dev`           | Starts a development instance of the app |



