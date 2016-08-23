defmodule Juicebox.Stream.Control do
  def start(%{playing: nil} = state) do
    play_next(state)
  end
  def start(state), do: state

  def play_next(state) do
    stop_track(state)
    |> next_track
    |> start_timer
  end


  def stop_track(%{playing: nil} = state), do: state

  def stop_track(%{history: history, playing: track} = state) do
    %{state | playing: nil,
              history: [track | history]}
  end


  def next_track(%{queue: []} = state) do
    %{state | playing: nil}
  end

  def next_track(%{queue: [track | queue]} = state) do
    %{state | queue: queue, playing: track}
  end

  def start_timer(state) do
    clear_timer(state)
    create_timer(state)
  end


  def create_timer(%{playing: nil} = state) do
    %{state | timer: nil}
  end

  def create_timer(%{playing: track} = state) do
    timer = Process.send_after(self(), :next, track.video.duration)
    %{state | timer: timer}
  end


  def clear_timer(%{timer: nil}), do: nil

  def clear_timer(%{timer: timer}) do
    Process.cancel_timer(timer)
  end

  def add_track(%{queue: queue} = state, track) do
    new_queue = queue ++ [track]
    %{state | queue: new_queue}
  end

  def vote(%{queue: queue} = state, track_id) do
    track_index = Enum.find_index(queue, fn(x) -> x.track_id == track_id end)

    track = Enum.at(queue, track_index)
            |> Map.update!(:votes, &(&1 + 1))

    new_queue = List.update_at(queue, track_index, fn(_) -> track end)
                |> Enum.sort(&(&1.votes > &2.votes))

    %{state | queue: new_queue}
  end

  def remaining_time(%{timer: nil}), do: {:error, "Not playing"}

  def remaining_time(%{timer: timer}) do
    {:ok, Process.read_timer(timer)}
  end
end
