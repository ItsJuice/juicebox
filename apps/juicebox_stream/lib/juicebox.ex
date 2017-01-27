defmodule JuiceboxStream do
  use Application

  # See http://elixir-lang.org/docs/stable/elixir/Application.html
  # for more information on OTP Applications
  def start(_type, _args) do
    import Supervisor.Spec, warn: false

    children = [
      # Start the Ecto repository
      worker(JuiceboxStream.Repo, []),
      worker(JuiceboxStream.Stream.Supervisor, []),
      # Here you could define other workers and supervisors as children
      # worker(JuiceboxStream.Worker, [arg1, arg2, arg3]),
      supervisor(Phoenix.PubSub.PG2, [JuiceboxStream.PubSub, []]),
      supervisor(Registry, [:unique, :stream_process_registry])
    ]

    # See http://elixir-lang.org/docs/stable/elixir/Supervisor.html
    # for other strategies and supported options
    opts = [strategy: :one_for_one, name: JuiceboxStream.Supervisor]
    Supervisor.start_link(children, opts)
  end
end
