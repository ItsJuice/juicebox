defmodule JuiceboxStream.Stream.BroadcastTests do
  use ExUnit.Case, async: true
  import JuiceboxStream.Stream.Broadcast

  describe ".broadcast/4" do
    test "broadcasts a message with the correct arguments" do
      pubsub = fn pubsub, topic, payload ->
        send self(), { pubsub, topic, payload }
      end

      broadcast("test", "ACTION", %{ example: "payload" }, pubsub)

      assert_received {
        JuiceboxStream.PubSub,
        "juicebox:stream:server:test",
        %{ type: "ACTION", example: "payload" }
      }
    end
  end
end
