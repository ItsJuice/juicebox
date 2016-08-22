defmodule Juicebox.Stream.Server do
  @moduledoc """
  Provides playlist-like behaviour for a queue of videos
  """

  alias Juicebox.Youtube.Video
  use GenServer

  def start_link(stream_id) do
    GenServer.start_link(__MODULE__, %{}, name: via_tuple(stream_id))
  end

  def init(queue) do
    {:ok, %{playing: nil, timer: nil, queue: []}}
  end

  @doc """
  Skips the currently playing video. Playback will stop if the queue is empty.
  """
  def skip(stream_id) do
    GenServer.call(via_tuple(stream_id), :skip)
  end

  @doc """
  Plays the video if one is not already playing, otherwise adds it to the
  queue.
  """
  def add(stream_id, video) do
    {:ok, state} = GenServer.call(via_tuple(stream_id), {:add, video})

    # auto-play if nothing was playing
    start(stream_id)
  end

  @doc """
  Returns (in ms) the playback time remaining for the current video
  """
  def remaining_time(stream_id) do
    GenServer.call(via_tuple(stream_id), :remaining_time)
  end

  @doc """
  Returns the currently playing video (%Juicebox.Youtube.Video{})
  """
  def playing(stream_id) do
    GenServer.call(via_tuple(stream_id), :playing)
  end

  @doc """
  Returns a list of videos currently in the queue
  """
  def queue(stream_id) do
    GenServer.call(via_tuple(stream_id), :get_queue)
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

  def handle_call({:add, video}, _from, %{queue: queue} = state) do
    new_queue = queue ++ [video]
    new_state = %{state | queue: new_queue}
    {:reply, {:ok, new_state}, new_state}
  end

  def handle_call(:get_queue, _from, %{queue: queue} = state), do: {:reply, {:ok, queue}, state}

  def handle_info(:next, state) do
    {:noreply, play_next(state)}
  end

  def get_next(%{queue: [video | queue]} = state) do
    {:ok, video, %{state | queue: queue}}
  end

  def get_next(%{queue: []} = state) do
    {:error, "Queue is empty"}
  end

  defp play_next(state) do
    clear_timer(state)

    case get_next(state) do
      {:ok, video, new_state} ->
        timer = Process.send_after(self(), :next, video.duration)
        %{new_state | playing: video,
                      timer: timer}
      {:error, error} ->
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
