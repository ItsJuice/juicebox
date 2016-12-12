defmodule JuiceboxStream.Stream.Server do
  @moduledoc """
  Provides playlist-like behaviour for a queue of tracks
  """
  use GenServer
  alias JuiceboxStream.Stream.Control
  import JuiceboxStream.Stream.Broadcast

  @silence_time Application.get_env(:juicebox_stream, :silence_time)

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
  Returns (in ms) the current playing position for the current track
  """
  def playing_time(stream_id) do
    GenServer.call(via_tuple(stream_id), :playing_time)
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

  def handle_call(:start, _from, %{playing: nil} = state) do
    new_state = play_next(state)
    {:reply, {:ok, new_state}, new_state}
  end

  def handle_call(:start, _from, state) do
    {:reply, {:ok, state}, state}
  end

  def handle_call(:remaining_time, _from, state) do
    {:reply, get_remaining_time(state), state}
  end

  def handle_call(:playing_time, _from, state) do
    {:reply, get_playing_time(state), state}
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
    broadcast(state.id, @actions[:QUEUE_UPDATED], %{ videos: new_state.queue })
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

  defp play_next(state) do
    new_state = Control.play_next(state)
    |> start_timer

    broadcast(state.id, @actions[:QUEUE_UPDATED], %{ videos: new_state.queue })
    broadcast(state.id, @actions[:PLAYING_CHANGED], %{ playing: new_state.playing })

    new_state
  end

  defp start_timer(state) do
    clear_timer(state)
    create_timer(state)
  end

  defp create_timer(%{playing: nil} = state) do
    %{state | timer: nil}
  end

  defp create_timer(%{playing: track} = state) do
    timer = Process.send_after(self(), :next, track.video.duration + @silence_time)
    %{state | timer: timer}
  end

  defp clear_timer(%{timer: nil}), do: nil

  defp clear_timer(%{timer: timer}) do
    Process.cancel_timer(timer)
  end

  defp get_remaining_time(%{timer: nil}), do: {:error, "Not playing"}

  defp get_remaining_time(%{timer: timer}) do
    {:ok, Process.read_timer(timer) - @silence_time}
  end

  defp get_playing_time(%{timer: nil}), do: {:error, "Not playing"}

  defp get_playing_time(%{timer: timer, playing: track} = state) do
    {:ok, time} = get_remaining_time(state)
    {:ok, track.video.duration - time}
  end

  defp via_tuple(stream_id) do
    {:via, :gproc, {:n, :l, {:stream, stream_id}}}
  end
end
