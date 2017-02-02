defmodule JuiceboxWeb.Reactions.ServerTest do
  use ExUnit.Case, async: true
  alias JuiceboxWeb.Reactions.Server, as: Reactions

  setup do
    {:ok, reactions} = Reactions.start_link("test")
    {:ok, reactions: reactions}
  end

  test "stores reaction videos by key", %{reactions: reactions} do
    assert Reactions.get("test", "oli") == nil

    Reactions.put("test", "oli", "video")
    assert Reactions.get("test", "oli") == "video"
  end

  test "deletes a video by key", %{reactions: reactions} do
    Reactions.put("test", "oli", "video")
    assert Reactions.get("test", "oli") == "video"

    Reactions.delete("test", "oli")
    assert Reactions.get("test", "oli") == nil
  end

  test "lists all reactions for a given stream_id", %{reactions: reactions} do
    Reactions.put("test", "oli", "video")
    Reactions.put("test", "piper", "another_video")

    assert Reactions.all("test") == %{
      "oli" => "video",
      "piper" => "another_video"
    }
  end

end
