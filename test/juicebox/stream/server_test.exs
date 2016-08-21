defmodule Juicebox.Stream.ServerTests do
  use ExUnit.Case, async: true
  alias Juicebox.Stream.Server, as: Stream
  alias Juicebox.Youtube.Video

  @stream "test"

  setup do
    {:ok, server} = Stream.start_link(@stream)

    [
      video: %Video{title: "Video", duration: 100},
      video_1: %Video{title: "Video 1", duration: 100},
      video_2: %Video{title: "Video 2", duration: 100},
      video_3: %Video{title: "Video 3", duration: 100},
      server: server
    ]
  end

  describe ".add" do
    test "auto-starts playback", ctx do
      {:ok, state} = Stream.add(@stream, ctx.video)
      assert state.playing == ctx.video
    end

    test "adds to the queue if already playing", ctx do
      {:ok, state} = Stream.add(@stream, ctx.video_1)
      assert state.playing == ctx.video_1

      {:ok, state} = Stream.add(@stream, ctx.video_2)
      assert state.queue == [ctx.video_2]

      {:ok, state} = Stream.add(@stream, ctx.video_3)
      assert state.queue == [ctx.video_2, ctx.video_3]
    end
  end

  describe ".playing" do
    test "auto-starts playback", ctx do
      Stream.add(@stream, ctx.video)

      assert Stream.playing(@stream) == {:ok, ctx.video}
    end
  end

  describe ".skip" do
    test "skips to the next item in the queue", ctx do
      Stream.add(@stream, ctx.video)
      Stream.add(@stream, ctx.video_1)
      Stream.add(@stream, ctx.video_2)
      Stream.add(@stream, ctx.video_3)

      {:ok, state} = Stream.skip(@stream)
      assert state.playing == ctx.video_1

      {:ok, state} = Stream.skip(@stream)
      assert state.playing == ctx.video_2

      {:ok, state} = Stream.skip(@stream)
      assert state.playing == ctx.video_3

      {:ok, state} = Stream.skip(@stream)
      assert state.playing == nil
    end
  end

  describe ".remaining_time" do
    test "returns the time remaining for the current video", ctx do
      Stream.add(@stream, ctx.video)

      :timer.sleep(10)
      {:ok, time} = Stream.remaining_time(@stream)
      assert time <= 90

      :timer.sleep(10)
      {:ok, time} = Stream.remaining_time(@stream)
      assert time <= 80
    end
  end

  describe "auto-play" do
    test "automatically plays videos until the queue is empty", ctx do
      Stream.add(@stream, ctx.video)
      Stream.add(@stream, ctx.video_1)
      Stream.add(@stream, ctx.video_2)

      assert Stream.playing(@stream) == {:ok, ctx.video}

      :timer.sleep(105)
      assert Stream.playing(@stream) == {:ok, ctx.video_1}

      :timer.sleep(105)
      assert Stream.playing(@stream) == {:ok, ctx.video_2}

      :timer.sleep(105)
      assert Stream.playing(@stream) == {:ok, nil}
    end

    test "automatically restarts playback when a video is added to the queue", ctx do
      Stream.add(@stream, ctx.video)
      assert Stream.playing(@stream) == {:ok, ctx.video}

      :timer.sleep(105)
      assert Stream.playing(@stream) == {:ok, nil}

      Stream.add(@stream, ctx.video_1)
      assert Stream.playing(@stream) == {:ok, ctx.video_1}

      :timer.sleep(105)
      assert Stream.playing(@stream) == {:ok, nil}
    end
  end

end
