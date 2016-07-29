defmodule Juicebox.Stream.Supervisor do
  use Supervisor

  def start_link do
    Supervisor.start_link(__MODULE__, [], name: :stream_supervisor)
  end

  def start_stream(stream_id) do
    Supervisor.start_child(:stream_supervisor, [stream_id])
  end

  def init(_) do
    children = [
      worker(Juicebox.Stream.Server, [])
    ]

    supervise(children, strategy: :simple_one_for_one)
  end
end

