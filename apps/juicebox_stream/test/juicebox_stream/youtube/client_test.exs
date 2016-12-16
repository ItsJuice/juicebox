defmodule JuiceboxStream.Youtube.ClientTests do
  use ExUnit.Case, async: true
  alias JuiceboxStream.Youtube.{Client, Video}

  test ".search/1" do
    {:ok, results} = Client.search("hello")
    assert results == [
      %Video{
        video_id: 1,
        title: "Dummy",
        description: "Video",
        thumbnail: "test.jpg",
        duration: 92000
      }
    ]
  end
end
