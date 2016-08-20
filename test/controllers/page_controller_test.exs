defmodule Juicebox.PageControllerTest do
  use Juicebox.ConnCase

  test "GET /" do
    conn = get build_conn(), "/"
    assert html_response(conn, 200) =~ "Juicebox"
  end
end
