defmodule JuiceboxStream.Stream.SupervisorTests do
  use ExUnit.Case, async: true
  alias JuiceboxStream.Stream.Supervisor

  setup do
    [
      stream_1_id: "stream1",
      stream_2_id: "stream2"
    ]
  end

  describe ".streams" do
    test "returns the default stream, plus any others being added", ctx do
      {:ok, _} = Supervisor.start_stream(ctx.stream_1_id)
      {:ok, _} = Supervisor.start_stream(ctx.stream_2_id)

      assert Supervisor.streams |> Enum.sort == ["main", "stream1", "stream2"]
    end
  end
end
