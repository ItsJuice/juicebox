defmodule JuiceboxStream.Youtube.DummyAPI do
  @spec search(String.t, map) :: map
  def search("bad", _) do
    %{error: "Some API Error"}
  end

  @spec search(any, any) :: map
  def search(_, _) do
    %{
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
    }
  end

  @spec videos(any, any) :: map
  def videos(_, _) do
    %{
      "items" => [%{
        "id" =>  1,
        "contentDetails" => %{
          "duration" => "PT1M32S"
        }
      }]
    }
  end
end
