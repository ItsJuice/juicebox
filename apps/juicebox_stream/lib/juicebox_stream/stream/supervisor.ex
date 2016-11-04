defmodule JuiceboxStream.Stream.Supervisor do
  use Supervisor
  alias JuiceboxStream.Stream.Server, as: Stream

  def start_link do
    Supervisor.start_link(__MODULE__, [], name: :stream_supervisor)
    start_stream("main")
  end

  def start_stream(stream_id) do
    Supervisor.start_child(:stream_supervisor, [stream_id])
  end

  def streams do
    Supervisor.which_children(:stream_supervisor)
    |> Enum.map(&stream_id_from_child(&1))
  end

  defp stream_id_from_child({_, pid, _, _}) do
    case Stream.id(pid) do
      {:ok, id} -> id
    end
  end

  def init(_) do
    children = [
      worker(Stream, [])
    ]

    supervise(children, strategy: :simple_one_for_one)
  end
end

