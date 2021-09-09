# Car List App

My first app! 🐱‍💻

This is an app I developed while learning html/css/javascript/node. My twin toddlers are obsessed with vehicles, so I developed an app for us to store their favourites.

Some of the functionality may seem silly; however, these aspects were included based on funny interactions with my kids For example, I added the ability to change the colour of the headlights (of car at top of page) after my kids started yelling out different colors the first time they saw the headlights turn on (they had just learned how to say a few colours!).

# Development

## .env

Rename .env.sample to .env and update with your FLICKR api key

## Server

Start server with nodemon.

```
cd server
npm run devStart
```

## Public/Client

Start client with lite-server

```
cd public
npm run devStart
```

# Deployment

## Heroku Deployment

Back end server currently deployed on heroku at https://tar-list.herokuapp.com

- Deployed from github subdirectory heroku_server using https://github.com/timanovsky/subdir-heroku-buildpack.git

  - add above github url as first heroku buildpack
  - add heroku nodejs as section buildpack

## Netlify Deployment

Front end currently deployed on netlify at https://tar-list.netlify.app/
