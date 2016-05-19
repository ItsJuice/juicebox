defmodule Juicebox.ApiController do
  use Juicebox.Web, :controller

  import Juicebox.Youtube

  def videos(conn, params) do
    case Juicebox.Youtube.search(params["q"]) do
      {:ok, videos} ->
        render(conn, videos: videos)
      {:error, _} ->
        json(conn, %{error: "Unable to fetch results"})
    end
  end
end
