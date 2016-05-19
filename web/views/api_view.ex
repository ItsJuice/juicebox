defmodule Juicebox.ApiView do
  use Juicebox.Web, :view

  def render("videos.json", %{videos: videos}) do
    videos
  end
end
