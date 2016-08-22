defmodule Juicebox.Stream.Server do
  @moduledoc """
  Provides playlist-like behaviour for a queue of tracks
  """
  use GenServer

  def start_link(stream_id) do
    GenServer.start_link(__MODULE__, %{}, name: via_tuple(stream_id))
  end

  def init(_) do
    {:ok, %{playing: nil, timer: nil, queue: []}}
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
  Returns the currently playing track (%Juicebox.Stream.Track{})
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
    GenServer.call(via_tuple(stream_id), {:vote, track_id})
  end

  defp start(stream_id) do
    GenServer.call(via_tuple(stream_id), :start)
  end

  ####

  def handle_call(:start, _from, %{playing: nil} = state) do
    new_state = play_next(state)
    {:reply, {:ok, new_state}, new_state}
  end

  def handle_call(:start, _from, %{playing: _} = state), do: {:reply, {:ok, state}, state}

  def handle_call(:remaining_time, _from, state) do
    {:reply, {:ok, Process.read_timer(state.timer)}, state}
  end

  def handle_call(:playing, _from, state) do
    {:reply, {:ok, state.playing}, state}
  end

  def handle_call(:skip, _from, state) do
    new_state = play_next(state)
    {:reply, {:ok, new_state}, new_state}
  end

  def handle_call({:add, track}, _from, %{queue: queue} = state) do
    new_queue = queue ++ [track]
    new_state = %{state | queue: new_queue}
    {:reply, {:ok, new_state}, new_state}
  end

  def handle_call(:get_queue, _from, %{queue: queue} = state), do: {:reply, {:ok, queue}, state}

  def handle_call({:vote, track_id}, _from, %{queue: queue} = state) do
    track_index = Enum.find_index(queue, fn(x) -> x.track_id == track_id end)

    track = Enum.at(queue, track_index)
            |> Map.update!(:votes, &(&1 + 1))

    new_queue = List.update_at(queue, track_index, fn(_) -> track end)
                |> Enum.sort(&(&1.votes > &2.votes))

    {:reply, {:ok, track}, %{state | queue: new_queue}}
  end

  def handle_info(:next, state) do
    {:noreply, play_next(state)}
  end

  def get_next(%{queue: [track | queue]} = state) do
    {:ok, track, %{state | queue: queue}}
  end

  def get_next(%{queue: []}) do
    {:error, "Queue is empty"}
  end

  defp play_next(state) do
    clear_timer(state)

    case get_next(state) do
      {:ok, track, new_state} ->
        timer = Process.send_after(self(), :next, track.video.duration)
        %{new_state | playing: track,
                      timer: timer}
      {:error, _} ->
        %{state | playing: nil,
                  timer: nil}
    end
  end

  defp clear_timer(%{timer: nil}), do: nil

  defp clear_timer(%{timer: timer}) do
    Process.cancel_timer(timer)
  end

  defp via_tuple(stream_id) do
    {:via, :gproc, {:n, :l, {:stream, stream_id}}}
  end
end
