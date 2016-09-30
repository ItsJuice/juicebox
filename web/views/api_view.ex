defmodule Juicebox.ApiView do

  def render("videos.json", %{videos: videos}) do
    videos
  end
end
