defmodule JuiceboxWeb.PageControllerTest do
  use JuiceboxWeb.ConnCase

  test "GET /" do
    conn = get build_conn(), "/"
    assert html_response(conn, 200) =~ "JuiceboxWeb"
  end
end
