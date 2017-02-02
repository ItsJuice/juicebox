use Mix.Config

# Do not print debug messages in production
config :logger, level: :info

# Configure your database
config :juicebox_stream, JuiceboxStream.Repo,
  adapter: Ecto.Adapters.Postgres,
  url: System.get_env("DATABASE_URL"),
  size: 20 # The amount of database connections in the pool

config :juicebox_stream, :youtube_api, JuiceboxStream.Youtube.API
config :juicebox_stream,
  :silence_time,
  String.to_integer(System.get_env("SILENCE_TIME")) # silence between tracks

config :juicebox_stream, JuiceboxStream.Youtube,
  api_key: System.get_env("YOUTUBE_API_KEY")
