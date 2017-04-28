defmodule JuiceboxStream.Stream.ServerTests do
  use ExUnit.Case, async: true
  alias JuiceboxStream.Stream.Server, as: Stream
  alias JuiceboxStream.Stream.Track
  alias JuiceboxStream.Youtube.Video

  @silence_time Application.get_env(:juicebox_stream, :silence_time)
  @stream "test"

  defp sleep_until_next_track do
    :timer.sleep(35 + @silence_time)
  end

  defp create_track(track_id, attrs \\ %{}) do
    %Track{
      video: Map.merge(%Video{title: "Video", duration: 30, video_id: track_id}, attrs)
    }
  end

  setup do
    {:ok, server} = Stream.start_link(@stream)

    [
      track: create_track(0),
      track_1: create_track(1, %{title: "Video 1", duration: 30}),
      track_2: create_track(2, %{title: "Video 2", duration: 30}),
      track_3: create_track(3, %{title: "Video 3", duration: 30}),
      server: server
    ]
  end

  describe ".add" do
    test "auto-starts playback", ctx do
      {:ok, state} = Stream.add(@stream, ctx.track)
      assert state.playing == ctx.track
    end

    test "adds to the queue if already playing", ctx do
      {:ok, state} = Stream.add(@stream, ctx.track_1)
      assert state.playing == ctx.track_1

      {:ok, state} = Stream.add(@stream, ctx.track_2)
      assert state.queue == [ctx.track_2]

      {:ok, state} = Stream.add(@stream, ctx.track_3)
      assert state.queue == [ctx.track_2, ctx.track_3]
    end
  end

  describe ".playing" do
    test "auto-starts playback", ctx do
      Stream.add(@stream, ctx.track)

      assert Stream.playing(@stream) == {:ok, ctx.track}
    end
  end

  describe ".skip" do
    test "skips to the next item in the queue", ctx do
      Stream.add(@stream, ctx.track)
      Stream.add(@stream, ctx.track_1)
      Stream.add(@stream, ctx.track_2)
      Stream.add(@stream, ctx.track_3)

      {:ok, state} = Stream.skip(@stream)
      assert state.playing == ctx.track_1

      {:ok, state} = Stream.skip(@stream)
      assert state.playing == ctx.track_2

      {:ok, state} = Stream.skip(@stream)
      assert state.playing == ctx.track_3

      {:ok, state} = Stream.skip(@stream)
      assert state.playing == nil
    end
  end

  describe ".remaining_time" do
    test "returns the time remaining for the current track", ctx do
      Stream.add(@stream, ctx.track)

      :timer.sleep(10)
      {:ok, time} = Stream.remaining_time(@stream)
      assert time <= 20

      :timer.sleep(10)
      {:ok, time} = Stream.remaining_time(@stream)
      assert time <= 10
    end

    test "returns an error if nothing is playing" do
      assert {:error, _} = Stream.remaining_time(@stream)
    end
  end


  describe ".playing_time" do
    test "returns the elapsed time for the current track", ctx do
      Stream.add(@stream, ctx.track)

      :timer.sleep(10)
      {:ok, time} = Stream.playing_time(@stream)
      assert time >= 10
      assert time < 20

      :timer.sleep(10)
      {:ok, time} = Stream.playing_time(@stream)
      assert time >= 20
      assert time < 30
    end

    test "returns an error if nothing is playing" do
      assert {:error, _} = Stream.playing_time(@stream)
    end
  end

  describe ".queue" do
    test "returns the tracks in the queue", ctx do
      Stream.add(@stream, ctx.track)
      Stream.add(@stream, ctx.track_1)
      Stream.add(@stream, ctx.track_2)

      assert Stream.queue(@stream) == {:ok, [ctx.track_1, ctx.track_2]}
    end
  end

  describe ".vote_up" do
    test "increments the vote count for a given track", ctx do
      Stream.add(@stream, ctx.track)
      Stream.add(@stream, ctx.track_1)
      Stream.add(@stream, ctx.track_2)

      {:ok, [track, _]} = Stream.queue(@stream)
      assert track.votes == 0

      Stream.vote_up(@stream, 1)
      {:ok, [track, _]} = Stream.queue(@stream)
      assert track.votes == 1

      Stream.vote_up(@stream, 1)
      {:ok, [track, _]} = Stream.queue(@stream)
      assert track.votes == 2

      # ensure we're only updating one track
      {:ok, [_, track]} = Stream.queue(@stream)
      assert track.votes == 0
    end

    test "sorts the queue by the number of votes", ctx do
      Stream.add(@stream, ctx.track)
      Stream.add(@stream, ctx.track_1)
      Stream.add(@stream, ctx.track_2)

      assert {:ok, [
        %{ctx.track_1 | votes: 0},
        %{ctx.track_2 | votes: 0}
      ]} == Stream.queue(@stream)

      Stream.vote_up(@stream, 2)
      assert {:ok, [
        %{ctx.track_2 | votes: 1},
        %{ctx.track_1 | votes: 0}
      ]} == Stream.queue(@stream)

      Stream.vote_up(@stream, 1)
      Stream.vote_up(@stream, 1)
      assert {:ok, [
        %{ctx.track_1 | votes: 2},
        %{ctx.track_2 | votes: 1}
      ]} == Stream.queue(@stream)
    end
  end

  describe ".history" do
    test "returns all previously played tracks", ctx do
      Stream.add(@stream, ctx.track)
      Stream.add(@stream, ctx.track_1)
      Stream.add(@stream, ctx.track_2)

      assert Stream.history(@stream) == {:ok, []}
      Stream.skip(@stream)
      assert Stream.history(@stream) == {:ok, [ctx.track]}
      sleep_until_next_track()
      assert Stream.history(@stream) == {:ok, [ctx.track_1, ctx.track]}
      Stream.skip(@stream)
      assert Stream.history(@stream) == {:ok, [ctx.track_2, ctx.track_1, ctx.track]}
    end
  end

  describe "auto-play" do
    test "automatically plays tracks until the queue is empty", ctx do
      Stream.add(@stream, ctx.track)
      Stream.add(@stream, ctx.track_1)
      Stream.add(@stream, ctx.track_2)

      assert Stream.playing(@stream) == {:ok, ctx.track}

      sleep_until_next_track()
      assert Stream.playing(@stream) == {:ok, ctx.track_1}

      sleep_until_next_track()
      assert Stream.playing(@stream) == {:ok, ctx.track_2}

      sleep_until_next_track()
      assert Stream.playing(@stream) == {:ok, nil}
    end

    test "automatically restarts playback when a track is added to the queue", ctx do
      Stream.add(@stream, ctx.track)
      assert Stream.playing(@stream) == {:ok, ctx.track}

      sleep_until_next_track()
      assert Stream.playing(@stream) == {:ok, nil}

      Stream.add(@stream, ctx.track_1)
      assert Stream.playing(@stream) == {:ok, ctx.track_1}

      sleep_until_next_track()
      assert Stream.playing(@stream) == {:ok, nil}
    end

    test "respects the number of votes", ctx do
      Stream.add(@stream, ctx.track)
      Stream.add(@stream, ctx.track_1)
      Stream.add(@stream, ctx.track_2)

      assert Stream.playing(@stream) == {:ok, ctx.track}

      Stream.vote_up(@stream, 2)
      Stream.vote_up(@stream, 2)
      Stream.vote_up(@stream, 1)

      sleep_until_next_track()
      assert Stream.playing(@stream) == {:ok, %{ctx.track_2 | votes: 2}}

      sleep_until_next_track()
      assert Stream.playing(@stream) == {:ok, %{ctx.track_1 | votes: 1}}

      sleep_until_next_track()
      assert Stream.playing(@stream) == {:ok, nil}
    end
  end

  describe ".id" do
    test "with a pid it returns the id of the stream", ctx do
      {:ok, stream_id} = Stream.id(ctx.server)
      assert stream_id == @stream
    end

    test "with a string it returns an error" do
      {status, _} = Stream.id("some_id")

      assert status == :error
    end
  end

end
