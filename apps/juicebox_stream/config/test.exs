use Mix.Config

# Print only warnings and errors during test
config :logger, level: :warn

# Configure your database
config :juicebox_stream, JuiceboxStream.Repo,
  adapter: Ecto.Adapters.Postgres,
  username: "postgres",
  password: "postgres",
  database: "juicebox_test",
  hostname: "localhost",
  pool: Ecto.Adapters.SQL.Sandbox

config :juicebox_stream, :youtube_api, JuiceboxStream.Youtube.DummyAPI

config :juicebox_stream, :silence_time, 100 # silence between tracks
