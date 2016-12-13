defmodule JuiceboxWeb.Reactions.Server do
  @doc """
  Starts the Reactions process.
  """
  def start_link(stream_id) do
    Agent.start_link(fn -> %{} end, name: via_tuple(stream_id))
  end

  @doc """
  Gets a video by key.
  """
  def get(stream_id, key) do
    Agent.get(via_tuple(stream_id), &Map.get(&1, key))
  end

  @doc """
  Gets all videos for a given stream_id.
  """
  def all(stream_id) do
    Agent.get(via_tuple(stream_id), fn reactions -> reactions end)
  end

  @doc """
  Updates the video for the given key
  """
  def put(stream_id, key, video) do
    Agent.update(via_tuple(stream_id), &Map.put(&1, key, video))
  end

  @doc """
  Removes a video for a given key
  """
  def delete(stream_id, key) do
    Agent.get_and_update(via_tuple(stream_id), &Map.pop(&1, key))
  end

  defp via_tuple(stream_id) do
    {:via, :gproc, {:n, :l, {:reactions, stream_id}}}
  end
end
