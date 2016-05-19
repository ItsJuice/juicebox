defmodule Juicebox.ApiController do
  use Juicebox.Web, :controller

  import Juicebox.Youtube

  def videos(conn, params) do
    videos = Juicebox.Youtube.search(params["q"])
    render conn, videos: videos
  end
end
