# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.
use Mix.Config

# Configures the endpoint
config :juicebox_web, JuiceboxWeb.Endpoint,
  url: [host: "localhost"],
  root: Path.dirname(__DIR__),
  secret_key_base: "No9mtCruMHSAH008T+QrGyMu1wYUK41cycpxrQBEACwfDznEzo6yI73Yn+IUiyt6",
  render_errors: [accepts: ~w(html json)],
  pubsub: [name: JuiceboxWeb.PubSub,
           adapter: Phoenix.PubSub.PG2]

config :juicebox_web, ecto_repos: [JuiceboxWeb.Repo]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env}.exs"

# Configure phoenix generators
config :phoenix, :generators,
  migration: true,
  binary_id: false