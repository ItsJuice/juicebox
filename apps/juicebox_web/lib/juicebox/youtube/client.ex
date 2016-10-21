defmodule JuiceboxWeb.Youtube.Client do
  @youtube_api Application.get_env(:juicebox_web, :youtube_api)

  def search(query) do
    with {:ok, response} <- @youtube_api.search(query),
         parsed = parse_response(response),
         do: format_response(parsed)
  end

  defp parse_response(%{body: body}) do
    Poison.Parser.parse!(body)
  end

  defp format_response(%{"items" => items}) do
    {:ok, Enum.map(items, &format_video/1)}
  end

  defp format_response(%{"error" => error}) do
    {:error, error}
  end

  defp format_video(video) do
    %{
      "id" => %{
        "videoId" => video_id
      },
      "snippet" => %{
        "title" => title,
        "description" => description,
        "duration" => duration,
        "thumbnails" => %{
          "high" => %{
            "url" => thumbnail
          }
        }
      }
    } = video

    %JuiceboxWeb.Youtube.Video{
       video_id: video_id,
       title: title,
       description: description,
       duration: duration,
       thumbnail: thumbnail
     }
  end
end
