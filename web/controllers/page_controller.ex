defmodule Jukebox.PageController do
  use Jukebox.Web, :controller

  def index(conn, _params) do
    render conn, "index.html"
  end
end
