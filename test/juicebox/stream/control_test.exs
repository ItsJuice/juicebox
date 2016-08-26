defmodule Juicebox.Stream.ControlTests do
  use ExUnit.Case, async: true
  alias Juicebox.Stream.Control, as: Control

  setup do
    [
      state: %{
        playing: nil,
        history: [],
        queue: [],
        timer: nil
      },
      videos: {
        %{ track_id: 1, votes: 0 },
        %{ track_id: 2, votes: 0 },
        %{ track_id: 3, votes: 0 }
      }
    ]
  end

  describe ".stop_tack" do
    test "stops playing and adds currently playing tack to history", ctx do
      {v1, _, _} = ctx.videos

      state = Control.stop_track(%{playing: v1, history: []})

      assert state.playing == nil
      assert state.history == [v1]
    end
  end

  describe ".next_track" do
    test "removes an item from the queue and starts playing it", ctx do
      {v1, v2, _} = ctx.videos

      state = Control.next_track(%{playing: nil, queue: [v1, v2]})

      assert state.playing == v1
      assert state.queue == [v2]
    end
  end

  describe ".add_track" do
    test "adds a track to the queue", ctx do
      {v1, v2, v3} = ctx.videos

      state = Control.add_track(%{queue: []}, v1)
              |> Control.add_track(v2)
              |> Control.add_track(v3)

      assert state.queue == [v1, v2, v3]
    end
  end

  describe ".vote" do
    test "increments the vote count on a given track", ctx do
      {v1, v2, _} = ctx.videos

      state = Control.vote(%{queue: [v1, v2]}, v1.track_id)
      %{queue: [video_1, video_2]} = state

      assert video_1.votes == 1
      assert video_2.votes == 0
    end

    test "sorts the queue by the number of votes", ctx do
      {v1, v2, v3} = ctx.videos

      state = %{queue: [v1, v2, v3]}
              |> Control.vote(v2.track_id)
              |> Control.vote(v2.track_id)
              |> Control.vote(v3.track_id)
      %{queue: [first, second, third]} = state

      assert first.track_id == 2
      assert second.track_id == 3
      assert third.track_id == 1
    end
  end
end
