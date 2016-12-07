defmodule JuiceboxWeb.Reactions do
  @doc """
  Starts the Reactions process.
  """
  def start_link do
    Agent.start_link(fn -> %{} end)
  end

  @doc """
  Gets a video by key.
  """
  def get(reactions, key) do
    Agent.get(reactions, &Map.get(&1, key))
  end

  @doc """
  Updates the video for the given key
  """
  def put(reactions, key, video) do
    Agent.update(reactions, &Map.put(&1, key, video))
  end

  @doc """
  Removes a video for a given key
  """
  def delete(reactions, key) do
    Agent.get_and_update(reactions, &Map.pop(&1, key))
  end
end
