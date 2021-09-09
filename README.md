# Car List App

My first app! 🐱‍💻

This is an app I developed while learning html/css/javascript/node. My twin toddlers are obsessed with vehicles, so I developed an app for us to store their favourites.

Some of the functionality may seem silly; however, these aspects were included based on funny interactions with my kids. For example, I added the ability to change the colour of the red car's headlights after my kids started yelling out different colors the first time they saw the headlights turn on (they had just learned how to say a few colours!).

Front end currently deployed on netlify at https://tar-list.netlify.app/

![screencapture-tar-list-netlify-app-2021-09-09-15_38_13](https://user-images.githubusercontent.com/85373263/132771732-29a3b6da-ca72-43aa-9d8e-3d599d1e105b.png)

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

# Screenshots

![screencapture-tar-list-netlify-app-2021-09-09-15_46_20](https://user-images.githubusercontent.com/85373263/132772758-bed14824-855d-4146-9169-dc8dc061687a.png)

![screencapture-tar-list-netlify-app-2021-09-09-15_38_13](https://user-images.githubusercontent.com/85373263/132771732-29a3b6da-ca72-43aa-9d8e-3d599d1e105b.png)

![screencapture-tar-list-netlify-app-2021-09-09-15_41_22](https://user-images.githubusercontent.com/85373263/132772922-9222b440-1eae-402a-bcec-ddd18f5c914f.png)

![screencapture-tar-list-netlify-app-2021-09-09-15_42_39](https://user-images.githubusercontent.com/85373263/132773066-a4f8722c-b96a-45a8-bdb1-84d463257bc4.png)

![screencapture-tar-list-netlify-app-2021-09-09-15_43_31](https://user-images.githubusercontent.com/85373263/132773102-73c17ced-f311-4518-85d6-6013e0dd9103.png)

![screencapture-tar-list-netlify-app-2021-09-09-15_43_52](https://user-images.githubusercontent.com/85373263/132773161-0970f6fa-8ce2-4f8f-97f5-40457ac3be94.png)
