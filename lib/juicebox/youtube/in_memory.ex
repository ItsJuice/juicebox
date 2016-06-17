defmodule Juicebox.Youtube.InMemory do
  @behaviour Juicebox.Youtube
  alias Juicebox.Youtube.Video, as: Video

  def search(_) do
    videos = [%Video{
      video_id: 1,
      title: "Movie Bloopers",
      description: "Some funny movie bloopers",
      thumbnail: "https://i.ytimg.com/vi/1IZldRSGW50/hqdefault.jpg"
    }]

    {:ok, videos}
  end
end
