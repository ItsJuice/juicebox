defmodule JuiceboxWeb.StreamChannel do
  use Phoenix.Channel

  alias Phoenix.PubSub
  alias JuiceboxWeb.Presence
  alias JuiceboxStream.Stream.Server, as: Stream
  alias JuiceboxWeb.Reactions.Server, as: Reactions

  intercept ["queue.updated"]

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

  def handle_in("video.added", %{"stream_id" => stream_id, "video" => video} = _, socket) do
    {:ok, state} = Stream.add(stream_id, %{ video: (for {key, val} <- video, into: %{}, do: { String.to_atom(key), val}) } )

    {:noreply, socket}
  end

  def handle_in("reaction.sent", %{"stream_id" => stream_id, "video" => video}, socket) do
    %{"video" => video_data} = video
    Reactions.put(stream_id, socket.assigns.user_id, video_data)

    broadcast_reaction(socket, %{ video: video_data, user_id: socket.assigns.user_id })

    {:noreply, socket}
  end

  def handle_info(%{ type: _ } = event, socket) do

    broadcast! socket, "remote.action", event

    {:noreply, socket}
  end

  def handle_info({:after_join, stream_id}, socket) do
    push socket, "presence_state", Presence.list(socket)
    {:ok, _} = Presence.track(socket, socket.assigns.user_id, %{
      online_at: inspect(System.system_time(:seconds))
    })

    Reactions.all(stream_id)
    |> Enum.each(fn({user_id, video}) -> {
      push_reaction(socket, %{ user_id: user_id, video: video })
    } end)

    {:ok, queue} = Stream.queue(stream_id)

    push socket, "remote.action", %{ videos: queue, type: "QUEUE_UPDATED" }

    {:noreply, socket}
  end

  def terminate(_reason, socket) do
    Reactions.delete(socket.assigns.stream_id, socket.assigns.user_id)
    broadcast_reaction(socket, %{ user_id: socket.assigns.user_id, video: nil })
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
