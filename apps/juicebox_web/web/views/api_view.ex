defmodule JuiceboxWeb.ApiView do
  use JuiceboxWeb.Web, :view

  def render("videos.json", %{videos: videos}) do
    videos
  end
end
