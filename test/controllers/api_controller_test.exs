defmodule Juicebox.ApiControllerTest do
  use Juicebox.ConnCase, async: true

  test "GET /api/videos?q=good" do
    response = get conn(), "/api/videos?q=good"
    assert [%{}] = json_response(response, 200)
  end

  test "GET /api/videos?q=bad" do
    response = get conn(), "/api/videos?q=bad"
    assert %{"error" => _} = json_response(response, 500)
  end

end
