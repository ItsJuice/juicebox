# JuiceboxWeb

[![Build Status](https://travis-ci.org/ItsJuice/juicebox.svg?branch=master)](https://travis-ci.org/ItsJuice/juicebox)

First install Elixir:

```bash
brew update
brew install elixir
```

To start your Phoenix app:

  1. Install dependencies with `mix deps.get`
  2. Create and migrate your database with `mix ecto.create && mix ecto.migrate`
  3. Install npm dependencies with `npm install`
  4. Start Phoenix endpoint with `mix phoenix.server`

Now you can visit [`localhost:4000`](http://localhost:4000) from your browser.

Ready to run in production? Please [check our deployment guides](http://www.phoenixframework.org/docs/deployment).

## Deploy to heroku
The only setup is that you need to install two buildpacks:

```bash
heroku buildpacks:add heroku/nodejs
heroku buildpacks:add heroku/heroku-buildpack-elixir
```

## Running tests
```bash
phantomjs --wd
mix test
```

## Learn more

  * Official website: http://www.phoenixframework.org/
  * Guides: http://phoenixframework.org/docs/overview
  * Docs: http://hexdocs.pm/phoenix
  * Mailing list: http://groups.google.com/group/phoenix-talk
  * Source: https://github.com/phoenixframework/phoenix

## Troubleshooting

If you run into trouble with
```
$ mix ecto.create
```
run the commands
  1. ```CREATE ROLE postgres LOGIN CREATEDB;```
  2. ```ALTER ROLE postgres LOGIN;```
  3. ```ALTER ROLE postgres CREATEDB;```