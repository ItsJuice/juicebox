use Mix.Config

# Do not include metadata nor timestamps in development logs
config :logger, :console, format: "[$level] $message\n"

# Configure your database
config :juicebox_stream, JuiceboxStream.Repo,
  adapter: Ecto.Adapters.Postgres,
  username: "postgres",
  password: "postgres",
  database: "juicebox_dev",
  hostname: "localhost",
  pool_size: 10

config :juicebox_stream, :youtube_api, JuiceboxStream.Youtube.API

config :juicebox_stream, JuiceboxStream.Youtube,
  api_key: System.get_env("YOUTUBE_API_KEY")
