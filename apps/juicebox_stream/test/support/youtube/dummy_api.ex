defmodule JuiceboxStream.Youtube.DummyAPI do
  def search("bad", _) do
    %{error: "Some API Error"}
  end

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
