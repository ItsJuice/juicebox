defmodule Juicebox.ApiController do
  use Juicebox.Web, :controller
  import Juicebox.Youtube

  @youtube_api Application.get_env(:juicebox, :youtube_api)

  def videos(conn, params) do
    case @youtube_api.search(params["q"]) do
      {:ok, videos} ->
        render(conn, videos: videos)
      {:error, _} ->
        json(conn, %{error: "Unable to fetch results"})
    end
  end
end
