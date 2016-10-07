defmodule Juicebox.StreamChannel do
  use Phoenix.Channel

  alias Phoenix.PubSub
  alias Juicebox.Stream.Server, as: Stream

  intercept ["queue.updated"]

  def join("stream:" <> stream_id, _params, socket) do
    PubSub.subscribe(Juicebox.PubSub, "juicebox:stream:server:" <> stream_id)
    {:ok, queue} = Stream.queue(stream_id)
    {:ok, %{ queue: queue }, socket}
  end

  def handle_in("video.added", %{"stream_id" => stream_id, "video" => video} = _, socket) do
    {:ok, state} = Stream.add(stream_id, %{ video: (for {key, val} <- video, into: %{}, do: { String.to_atom(key), val}) } )
    
    {:noreply, socket}
  end

  def handle_out("queue.updated", payload, socket) do
    IO.inspect "Queue updated"

    push socket, "queue.updated", payload

    {:noreply, socket}
  end

  def handle_info(%{ action: 'update_queue', new_queue: new_queue }, socket) do
    IO.inspect "Got 'video.added' with #{inspect new_queue}"

    broadcast! socket, "queue.updated", %{ queue: new_queue }

    {:noreply, socket}
  end
end
