defmodule JuiceboxWeb.StreamChannel do
  use Phoenix.Channel

  alias Phoenix.PubSub
  alias Phoenix.Socket
  alias JuiceboxWeb.Presence
  alias JuiceboxStream.Stream.Server, as: Stream
  alias JuiceboxWeb.Reactions.Server, as: Reactions

  intercept ["queue.updated"]

  @spec join(String.t, map, Socket.t) :: {atom, Socket.t}
  def join("stream:" <> stream_id, _params, socket) do
    JuiceboxStream.Stream.Supervisor.start_stream(stream_id)
    JuiceboxWeb.Reactions.Supervisor.start_reactions(stream_id)

    PubSub.subscribe(JuiceboxStream.PubSub, "juicebox:stream:server:" <> stream_id)

    {:ok, queue} = Stream.queue(stream_id)

    send(self, {:after_join, stream_id})

    socket = socket
    |> assign(:user_id, uuid())
    |> assign(:stream_id, stream_id)

    {:ok, socket}
  end

  @spec handle_in(String.t, map, Socket.t) :: {:reply, atom, Socket.t}
  def handle_in("video.added", %{"stream_id" => stream_id, "video" => video} = _, socket) do
    {:ok, state} = Stream.add(stream_id, %{video: (for {key, val} <- video, into: %{}, do: {String.to_atom(key), val})})

    {:reply, :ok, socket}
  end

  @spec handle_in(String.t, map, Socket.t) :: {:reply, atom, Socket.t}
  def handle_in("video.skip_playing", %{"stream_id" => stream_id} = _, socket) do
    Stream.skip(stream_id)

    {:reply, :ok, socket}
  end

  @spec handle_in(String.t, map, Socket.t) :: {:reply, atom, Socket.t}
  def handle_in("reaction.sent", %{"stream_id" => stream_id, "video" => video, "frame" => frame}, socket) do
    Reactions.put(stream_id, socket.assigns.user_id, %{video: video, frame: frame})

    broadcast_reaction(socket, %{video: video, user_id: socket.assigns.user_id, frame: frame})

    {:reply, :ok, socket}
  end

  @spec handle_in(String.t, map, Socket.t) :: {:reply, atom, Socket.t}
  def handle_in("video.vote_up", %{"stream_id" => stream_id, "video_id" => video_id} = _, socket) do
    {:ok, state} = Stream.vote_up(stream_id, video_id)

    {:reply, :ok, socket}
  end

  @spec handle_in(String.t, map, Socket.t) :: {:reply, atom, Socket.t}
  def handle_in("video.vote_down", %{"stream_id" => stream_id, "video_id" => video_id} = _, socket) do
    {:ok, state} = Stream.vote_down(stream_id, video_id)

    {:reply, :ok, socket}
  end

  @spec handle_info(map, Socket.t) :: {:noreply, Socket.t}
  def handle_info(%{type: _} = event, socket) do

    broadcast! socket, "remote.action", event

    {:noreply, socket}
  end

  @spec handle_info({atom, String.t}, Socket.t) :: {atom, any}
  def handle_info({:after_join, stream_id}, socket) do
    push socket, "presence_state", Presence.list(socket)
    {:ok, _} = Presence.track(socket, socket.assigns.user_id, %{
      online_at: inspect(System.system_time(:seconds))
    })

    Reactions.all(stream_id)
    |> Enum.each(fn({user_id, %{video: video, frame: frame}}) -> {
      push_reaction(socket, %{user_id: user_id, video: video, frame: frame})
    } end)

    {:ok, queue} = Stream.queue(stream_id)
    {:ok, playing} = Stream.playing(stream_id)

    push socket, "remote.action", %{videos: queue, type: "QUEUE_UPDATED"}

    case Stream.playing_time(stream_id) do
      {:ok, playing_time} ->
        push socket, "remote.action", %{playing: playing, type: "PLAYING_CHANGED", time: playing_time}
      {:error, _} -> nil
    end

    {:noreply, socket}
  end

  @spec terminate(String.t, Socket.t) :: atom
  def terminate(_reason, socket) do
    Reactions.delete(socket.assigns.stream_id, socket.assigns.user_id)
    broadcast_reaction(socket, %{user_id: socket.assigns.user_id, video: nil})
    :ok
  end

  defp uuid do
    # Something better here
    to_string(:rand.uniform(10_000_000))
  end

  defp push_reaction(socket, data) do
    send_reaction(&push/3, socket, data)
  end

  defp broadcast_reaction(socket, data) do
    send_reaction(&broadcast!/3, socket, data)
  end

  defp send_reaction(method, socket, data) do
    method.(socket, "remote.action", Map.put(data, "type", "NEW_REACTION"))
  end
end
