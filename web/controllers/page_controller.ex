defmodule Juicebox.PageController do
  use Juicebox.Web, :controller

  def index(conn, _params) do
    render conn, "index.html"
  end
end
