defmodule JuiceboxWeb.ReactionsTest do
  use ExUnit.Case, async: true

  setup do
    {:ok, reactions} = JuiceboxWeb.Reactions.start_link
    {:ok, reactions: reactions}
  end

  test "stores reaction videos by key", %{reactions: reactions} do
    assert JuiceboxWeb.Reactions.get(reactions, "oli") == nil

    JuiceboxWeb.Reactions.put(reactions, "oli", "video_base64")
    assert JuiceboxWeb.Reactions.get(reactions, "oli") == "video_base64"
  end

  test "deletes a video by key", %{reactions: reactions} do
    JuiceboxWeb.Reactions.put(reactions, "oli", "video_base64")
    assert JuiceboxWeb.Reactions.get(reactions, "oli") == "video_base64"

    JuiceboxWeb.Reactions.delete(reactions, "oli")
    assert JuiceboxWeb.Reactions.get(reactions, "oli") == nil
  end
end
