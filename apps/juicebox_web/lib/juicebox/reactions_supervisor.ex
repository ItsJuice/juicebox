defmodule JuiceboxWeb.Reactions.Supervisor do
  use Supervisor
  alias JuiceboxWeb.Reactions.Server, as: Reactions

  def start_link do
    Supervisor.start_link(__MODULE__, [], name: :reactions_supervisor)
  end

  def start_reactions(stream_id) do
    Supervisor.start_child(:reactions_supervisor, [stream_id])
  end

  def init(_) do
    children = [
      worker(Reactions, [])
    ]

    supervise(children, strategy: :simple_one_for_one)
  end
end

