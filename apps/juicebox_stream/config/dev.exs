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
  api_key: System.get_env("YOUTUBE_API_KEY"),
  api_url: "https://www.googleapis.com/youtube/v3/search",
  search_params: %{
    part: "snippet",
    safeSearch: "strict",
    type: "video",
    videoCategoryId: "10", # music
    order: "viewCount",
    videoEmbeddable: "true"
  }