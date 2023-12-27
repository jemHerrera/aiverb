# Aiverb

A Language model for language learning.

Typescript - Express - PostgreSQL - Nuxt

## Setup

1. This repo uses pnpm. Install [pnpm](https://pnpm.io/) on your local.
2. Run `pnpm i`

## Run servers locally

`pnpm dev`

This will run:

- postgres
- pgAdmin
- api server
- nuxt server

This will automatically create the database and pgAdmin docker containers

## Run app specific scripts

With pnpm we can run scripts from inside each app from the root directory:

`pnpm api <script-name>` Example: `pnpm api dev`, `pnpm api build`
`pnpm nuxt <script-name>` Example: `pnpm nuxt dev`

## Create migration files

`pnpm create-migration`

## Migrate to DB

`pnpm migrate`

## Todo
