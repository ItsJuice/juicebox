defmodule JuiceboxStream.Stream.ControlTests do
  use ExUnit.Case, async: true
  alias JuiceboxStream.Stream.Control, as: Control

  setup do
    [
      state: %{
        playing: nil,
        history: [],
        queue: [],
        timer: nil
      },
      videos: {
        %{ video: %{ video_id: 1 }, votes: 0 },
        %{ video: %{ video_id: 2 }, votes: 0 },
        %{ video: %{ video_id: 3 }, votes: 0 }
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

      state = Control.next_track(%{playing: nil, queue: [v1, v2], id: "1"})

      assert state.playing == v1
      assert state.queue == [v2]
    end
  end

  describe ".add_track" do
    test "adds a track to the queue", ctx do
      {v1, v2, v3} = ctx.videos

      state = Control.add_track(%{queue: [], id: "1"}, v1)
              |> Control.add_track(v2)
              |> Control.add_track(v3)

      assert state.queue == [v1, v2, v3]
    end
  end

  describe ".vote_up" do
    test "increments the vote count on a given track", ctx do
      {v1, v2, _} = ctx.videos

      state = Control.vote_up(%{queue: [v1, v2]}, v1.video.video_id)
      %{queue: [video_1, video_2]} = state

      assert video_1.votes == 1
      assert video_2.votes == 0
    end

    test "sorts the queue by the number of votes", ctx do
      {v1, v2, v3} = ctx.videos

      state = %{queue: [v1, v2, v3]}
              |> Control.vote_up(v2.video.video_id)
              |> Control.vote_up(v2.video.video_id)
              |> Control.vote_up(v3.video.video_id)
      %{queue: [first, second, third]} = state

      assert first.video.video_id == 2
      assert second.video.video_id == 3
      assert third.video.video_id == 1
    end
  end
end
