defmodule JuiceboxStream.Stream.Control do
  @silence_time Application.get_env(:juicebox_stream, :silence_time)

  def play_next(state) do
    stop_track(state)
    |> next_track
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

  def add_track(%{queue: queue} = state, track) do
    # TODO: use Track struct
    track_with_votes = Map.merge(track, %{votes: 0})
    new_queue = queue ++ [track_with_votes]
    %{state | queue: new_queue}
  end

  def vote_up(%{queue: queue} = state, video_id) do
    track_index = Enum.find_index(queue, fn(x) -> x.video.video_id == video_id end)

    track = Enum.at(queue, track_index)
            |> Map.update!(:votes, &(&1 + 1))

    new_queue = List.update_at(queue, track_index, fn(_) -> track end)
                |> Enum.sort(&(&1.votes > &2.votes))

    %{state | queue: new_queue}
  end

  def vote_down(%{queue: queue} = state, video_id) do
    track_index = Enum.find_index(queue, fn(x) -> x.video.video_id == video_id end)

    track = Enum.at(queue, track_index)
            |> Map.update!(:votes, &(&1 - 1))

    new_queue = List.update_at(queue, track_index, fn(_) -> track end)
                |> Enum.sort(&(&1.votes > &2.votes))

    %{state | queue: new_queue}
  end
end
