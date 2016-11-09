defmodule JuiceboxStream.Stream.Broadcast do
  def broadcast(stream_id, action, payload, pubsub \\ &Phoenix.PubSub.broadcast/3) do
    pubsub.(JuiceboxStream.PubSub,
      "juicebox:stream:server:" <> stream_id,
      Map.put(payload, :type, action))
  end
end
