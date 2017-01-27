defmodule JuiceboxStream.Mixfile do
  use Mix.Project

  def project do
    [app: :juicebox_stream,
     version: "0.0.1",
     elixir: "~> 1.4",
     elixirc_paths: elixirc_paths(Mix.env),
     compilers: [:phoenix, :gettext] ++ Mix.compilers,
     build_embedded: Mix.env == :prod,
     start_permanent: Mix.env == :prod,
     aliases: aliases,
     deps: deps]
  end

  # Configuration for the OTP application.
  #
  # Type `mix help compile.app` for more information.
  def application do
    [mod: {JuiceboxStream, []},
     applications: [:cowboy, :logger, :phoenix_ecto, :postgrex, :httpoison, 
                    :gproc, :phoenix_pubsub, :gettext]]
  end

  # Specifies which paths to compile per environment.
  defp elixirc_paths(:test), do: ["lib", "test/support"]
  defp elixirc_paths(_),     do: ["lib"]

  # Specifies your project dependencies.
  #
  # Type `mix help deps` for examples and options.
  defp deps do
    [
      {:phoenix_pubsub, "~> 1.0"},
      {:phoenix_ecto, "~> 3.0-rc"},
      {:postgrex, "~> 0.11.2"},
      {:cowboy, "~> 1.0"},
      {:ex_machina, "~> 1.0", only: :test},
      {:junit_formatter, "~> 0.1", only: :test},
      {:httpoison, "~> 0.8.0"},
      {:gettext, "~> 0.9"},
      {:gproc, "~> 0.5.0"}
    ]
  end

  # Aliases are shortcut or tasks specific to the current project.
  # For example, to create, migrate and run the seeds file at once:
  #
  #     $ mix ecto.setup
  #
  # See the documentation for `Mix` for more info on aliases.
  defp aliases do
    ["ecto.setup": ["ecto.create", "ecto.migrate", "run priv/repo/seeds.exs"],
     "ecto.reset": ["ecto.drop", "ecto.setup"],
     "test": ["ecto.create --quiet", "ecto.migrate", "test"]]
  end
end
