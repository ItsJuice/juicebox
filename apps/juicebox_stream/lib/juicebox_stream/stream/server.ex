defmodule JuiceboxStream.Stream.Server do
  @moduledoc """
  Provides playlist-like behaviour for a queue of tracks
  """
  use GenServer
  import JuiceboxStream.Stream.Broadcast
  alias JuiceboxStream.Stream.Control

  @actions %{
    QUEUE_UPDATED: "QUEUE_UPDATED",
    PLAYING_CHANGED: "PLAYING_CHANGED"
  }

  def start_link(stream_id) do
    GenServer.start_link(__MODULE__, stream_id, name: via_tuple(stream_id))
  end

  def init(stream_id) do
    {:ok, %{playing: nil, timer: nil, queue: [], history: [], id: stream_id}}
  end

  @doc """
  Skips the currently playing track. Playback will stop if the queue is empty.
  """
  def skip(stream_id) do
    GenServer.call(via_tuple(stream_id), :skip)
  end

  @doc """
  Plays the track if one is not already playing, otherwise adds it to the
  queue.
  """
  def add(stream_id, track) do
    {:ok, _} = GenServer.call(via_tuple(stream_id), {:add, track})

    {:ok, new_queue} = queue(stream_id)
    broadcast(stream_id, @actions[:QUEUE_UPDATED], %{ videos: new_queue })

    # auto-play if nothing was playing
    start(stream_id)
  end

  @doc """
  Returns (in ms) the playback time remaining for the current track
  """
  def remaining_time(stream_id) do
    GenServer.call(via_tuple(stream_id), :remaining_time)
  end

  @doc """
  Returns the currently playing track (%JuiceboxStream.Stream.Track{})
  """
  def playing(stream_id) do
    GenServer.call(via_tuple(stream_id), :playing)
  end

  @doc """
  Returns a list of tracks currently in the queue
  """
  def queue(stream_id) do
    GenServer.call(via_tuple(stream_id), :get_queue)
  end

  @doc """
  Adds a vote to a given %Track{}
  """
  def vote(stream_id, track_id) do
    GenServer.cast(via_tuple(stream_id), {:vote, track_id})
  end

  @doc """
  Returns a list of previously played tracks
  """
  def history(stream_id) do
    GenServer.call(via_tuple(stream_id), :history)
  end

  @doc """
  Returns the stream id
  """
  def id(pid) when is_pid(pid) do
    GenServer.call(pid, :id)
  end

  def id(_), do: {:error, "Must be called with a pid"}


  defp start(stream_id) do
    GenServer.call(via_tuple(stream_id), :start)
  end

  ####

  def handle_call(:start, _from, state) do
    new_state = Control.start(state)
    {:reply, {:ok, new_state}, new_state}
  end

  def handle_call(:remaining_time, _from, state) do
    {:reply, Control.remaining_time(state), state}
  end

  def handle_call(:playing, _from, state) do
    {:reply, {:ok, state.playing}, state}
  end

  def handle_call(:skip, _from, state) do
    new_state = play_next(state)
    {:reply, {:ok, new_state}, new_state}
  end

  def handle_call({:add, track}, _from, state) do
    new_state = Control.add_track(state, track)
    {:reply, {:ok, new_state}, new_state}
  end

  def handle_call(:get_queue, _from, %{queue: queue} = state), do: {:reply, {:ok, queue}, state}

  def handle_call(:history, _from, %{history: history} = state) do
    {:reply, {:ok, history}, state}
  end

  def handle_call(:id, _from, %{id: id} = state) do
    {:reply, {:ok, id}, state}
  end

  def handle_cast({:vote, track_id}, state) do
    {:noreply, Control.vote(state, track_id)}
  end

  def handle_info(:next, state) do
    {:noreply, play_next(state)}
  end

  defp via_tuple(stream_id) do
    {:via, :gproc, {:n, :l, {:stream, stream_id}}}
  end

  defp play_next(%{ id: stream_id, queue: queue, playing: playing } = state) do
    broadcast(stream_id, @actions[:QUEUE_UPDATED], %{ videos: queue })
    broadcast(stream_id, @actions[:PLAYING_CHANGED], %{ playing: playing })
    Control.play_next(state)
  end
end
