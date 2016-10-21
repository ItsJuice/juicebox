use Mix.Config

# For development, we disable any cache and enable
# debugging and code reloading.
#
# The watchers configuration can be used to run external
# watchers to your application. For example, we use it
# with brunch.io to recompile .js and .css sources.
config :juicebox_web, JuiceboxWeb.Endpoint,
  http: [port: 4000],
  debug_errors: true,
  code_reloader: true,
  cache_static_lookup: false,
  check_origin: false,
  watchers: [node: ["node_modules/webpack/bin/webpack.js",
            "--watch-stdin", "--progress", "--colors",
            cd: Path.expand("../", __DIR__)]]


# Watch static and templates for browser reloading.
config :juicebox_web, JuiceboxWeb.Endpoint,
  live_reload: [
    patterns: [
      ~r{priv/static/.*(js|css|png|jpeg|jpg|gif|svg)$},
      ~r{web/views/.*(ex)$},
      ~r{web/templates/.*(eex)$}
    ]
  ]

# Do not include metadata nor timestamps in development logs
config :logger, :console, format: "[$level] $message\n"

# Set a higher stacktrace during development.
# Do not configure such in production as keeping
# and calculating stacktraces is usually expensive.
config :phoenix, :stacktrace_depth, 20

# Configure your database
config :juicebox_web, JuiceboxWeb.Repo,
  adapter: Ecto.Adapters.Postgres,
  username: "postgres",
  password: "postgres",
  database: "juicebox_dev",
  hostname: "localhost",
  pool_size: 10

config :juicebox_web, :youtube_api, JuiceboxWeb.Youtube.API

config :juicebox_web, JuiceboxWeb.Youtube,
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