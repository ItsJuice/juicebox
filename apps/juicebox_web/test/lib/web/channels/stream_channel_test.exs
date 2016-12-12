defmodule JuiceboxWeb.StreamChannelTest do
  use JuiceboxWeb.ChannelCase

  alias JuiceboxWeb.StreamChannel
  alias JuiceboxStream.Stream.Server, as: Stream
  alias JuiceboxWeb.Reactions.Server, as: Reactions

  @stream_id "main"
  @video %{id: "2222", duration: 30000}
  @video_2 %{id: "2223", duration: 30000}

  setup do
    JuiceboxStream.Stream.Supervisor.start_stream(@stream_id)
    JuiceboxWeb.Reactions.Supervisor.start_reactions(@stream_id)

    video_payload = %{"video" => @video, "stream_id" => @stream_id}
    reaction_payload = %{"video" => "BASE64 VIDEO", "stream_id" => @stream_id}

    { :ok, [ video_payload: video_payload, reaction_payload: reaction_payload ] }
  end

  def connect _ do
    {:ok, ref, socket} =
      subscribe_and_join(socket(), StreamChannel, "stream:" <> @stream_id)

    { :ok, [ socket: socket, id: socket.assigns.user_id ] }
  end

  def receive_video %{socket: socket, video_payload: payload} do
    ref = push(socket, "video.added", payload)
    assert_reply ref, :ok
    :ok
  end

  def receive_reaction %{socket: socket, reaction_payload: payload} do
    ref = push(socket, "reaction.sent", payload)
    assert_reply ref, :ok
    :ok
  end

  def with_some_reactions _ do
    Reactions.put(@stream_id, "user 1", "video 1")
    Reactions.put(@stream_id, "user 2", "video 2")
    Reactions.put(@stream_id, "user 3", "video 3")
    :ok
  end

  def with_some_videos _ do
    Stream.add(@stream_id, %{ video: @video })
    Stream.add(@stream_id, %{ video: @video_2 })
    :timer.sleep(5000)
    :ok
  end

  def disconnect %{socket: socket} do
    Process.unlink(socket.channel_pid)
    ref = leave(socket)
    assert_reply ref, :ok
    :ok
  end

  describe "Connecting" do
    setup [:with_some_reactions, :with_some_videos, :connect]

    #test "pushes all current reactions", %{socket: socket} do
    #  assert_push("remote.action", %{ video: "video 1", user_id: "user 1", "type": "NEW_REACTION" })
    #  assert_push("remote.action", %{ video: "video 2", user_id: "user 2", "type": "NEW_REACTION" })
    #  assert_push("remote.action", %{ video: "video 3", user_id: "user 3", "type": "NEW_REACTION" })
    #end

    test "pushes the current queue" do
      assert_push("remote.action", %{ videos: [%{video: @video}, %{video: @video_2}], "type": "QUEUE_UPDATED" })
    end
  end

  describe "Videos" do
    setup [:connect, :receive_video]

    test "video.added (in): adds a video to the stream" do
      assert Stream.playing(@stream_id) == {:ok, %{video: @video}}
    end
  end

  describe "Receiving a reaction" do
    setup [:connect, :receive_reaction]

    test "adds a reaction to the stream", %{id: id} do
      assert Reactions.get(@stream_id, id) == "BASE64 VIDEO"
    end

    test "broadcasts the new reaction to all clients",
          %{socket: socket, reaction_payload: payload, id: id} do

      assert_broadcast("remote.action", %{ video: payload, user_id: id })
    end
  end

  describe "Disconnecting" do
    setup [:connect, :receive_reaction, :disconnect]

    test "removes the user's reaction video", %{socket: socket} do
      video = Reactions.get(@stream_id, socket.assigns.user_id)
      assert video == nil
    end

    test "tells all clients to remove the reaction by broadcasting an empty reaction video",
          %{socket: socket} do

      assert_broadcast("remote.action", %{ video: nil, user_id: id })
    end
  end

end
