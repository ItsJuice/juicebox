defmodule Juicebox.Youtube.DummyAPI do
  def search("bad") do
    dummy_response(%{error: "Some API Error"})
  end

  def search(_) do
    dummy_response(%{
      "items" => [
        %{
          "id" => %{
            "videoId" => 1
          },
          "snippet" => %{
            "title" => "Dummy",
            "description" => "Video",
            "thumbnails" => %{
              "high" => %{
                "url" => "test.jpg"
              }
            }
          }
        }
      ]
    })
  end

  defp dummy_response(map) do
    {:ok, json} = Poison.encode(map)
    {:ok, %{body: json}}
  end
end
