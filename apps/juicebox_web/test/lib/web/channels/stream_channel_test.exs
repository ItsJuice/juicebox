defmodule JuiceboxWeb.StreamChannelTest do
  use JuiceboxWeb.ChannelCase

  alias JuiceboxWeb.StreamChannel
  alias JuiceboxStream.Stream.Server, as: Stream
  alias JuiceboxStream.Stream.Supervisor, as: StreamSupervisor
  alias JuiceboxWeb.Reactions.Server, as: Reactions

  @stream_id "channel tests"

  defp setup_and_join_socket(_) do
    {:ok, _, socket} =
      subscribe_and_join(socket(), StreamChannel, "stream:" <> @stream_id)
    {:ok, socket: socket, id: socket.assigns.user_id}
  end

  defp setup_stream(_) do
    {:ok, pid} = StreamSupervisor.start_stream(@stream_id)
    on_exit fn -> Process.exit(pid, :shutdown) end
    {:ok, stream_pid: pid}
  end

  defp add_videos_to_stream(_) do
    video_1 = %{id: "1111", duration: 30_000}
    video_2 = %{id: "2222", duration: 30_000}
    Stream.add(@stream_id, %{video: video_1})
    Stream.add(@stream_id, %{video: video_2})

    {:ok, video_1: video_1, video_2: video_2}
  end

  def receive_reaction %{socket: socket} do
    payload = %{"video" => "BASE64 VIDEO", "stream_id" => @stream_id, "frame" => "frame-1"}
    ref = push(socket, "reaction.sent", payload)
    assert_reply ref, :ok
    :ok
  end

  def disconnect %{socket: socket} do
    Process.unlink(socket.channel_pid)
    ref = leave(socket)
    assert_reply ref, :ok
    :ok
  end

  describe "adding a video" do
    setup [:setup_stream, :setup_and_join_socket]

    @video %{id: "2222", duration: 30_000}
    @payload %{"video" => @video, "stream_id" => @stream_id}

    test "adding a video", %{socket: socket} do
      push(socket, "video.added", @payload)
      :timer.sleep(5000);
      {:ok, state} = Stream.playing(@stream_id)
      assert state == %{video: @video, votes: 0}
    end
  end

  describe "joining a channel with no existing videos" do
    setup [:setup_stream, :setup_and_join_socket]
    test "after joining it receives an empty queue", _ do
      assert_push "remote.action", %{videos: [], type: "QUEUE_UPDATED"}
    end

    test "after joining it does not receive the playing video", _ do
      refute_push "remote.action", %{playing: _, type: "PLAYING_CHANGED", time: _}
    end
  end

  describe "joining a channel with an existing stream" do
    setup [:setup_stream, :add_videos_to_stream, :setup_and_join_socket]

    test "after joining it receives the proper queue", %{video_2: video_2} do
      expected_queue_response = %{videos: [video_2], type: "QUEUE_UPDATED"}
      assert_push "remote.action", expected_queue_response
    end

    test "after joining it receives the currently playing video", %{video_1: video_1} do
      assert_push "remote.action", %{playing: %{video: video_1}, type: "PLAYING_CHANGED", time: _}
    end
  end

  describe "receiving events to be broadcasted" do
    setup [:setup_stream, :setup_and_join_socket]
    test "after receiving a message with a type key it broadcasts it", %{socket: socket} do
      payload = %{type: 'TEST_TYPE', some_payload: 'some_values'}
      Phoenix.PubSub.broadcast(JuiceboxStream.PubSub,
                               "juicebox:stream:server:" <> @stream_id,
                               payload)
      assert_broadcast "remote.action", payload
    end
  end

  describe "Receiving a reaction" do
    setup [:setup_stream, :setup_and_join_socket, :receive_reaction]

    test "adds a reaction to the stream", %{id: id} do
      assert Reactions.get(@stream_id, id) == %{video: "BASE64 VIDEO", frame: "frame-1"}
    end

    test "broadcasts the new reaction to all clients", %{id: id} do
      payload = %{user_id: id, video: "BASE64 VIDEO", type: "NEW_REACTION", frame: "frame-1"}
      assert_broadcast "remote.action", payload
    end
  end

  describe "Disconnecting" do
    setup [:setup_stream, :setup_and_join_socket, :receive_reaction, :disconnect]

    test "removes the user's reaction video", %{socket: socket} do
      video = Reactions.get(@stream_id, socket.assigns.user_id)
      assert video == nil
    end

    test "tells all clients to remove the reaction by broadcasting an empty reaction video",
          %{socket: socket} do

      assert_broadcast("remote.action", %{video: nil, user_id: id})
    end
  end

end
