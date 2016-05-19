defmodule Juicebox.Youtube do
  import HTTPoison

  @youtube_api_url "https://www.googleapis.com/youtube/v3/search"

  @youtube_params %{
    part: "snippet",
    safeSearch: "strict",
    type: "video",
    videoCategoryId: "10", # music
    order: "viewCount",
    videoEmbeddable: "true"
  }

  def search(query) do
    with {:ok, body} <- make_request(query, config(:api_key)),
         parsed = parse_response(body),
         do: {:ok, format_response(parsed)}
  end

  defp make_request(query, key) do
    params = Map.merge(@youtube_params, %{
      q: query,
      key: key
    })

    HTTPoison.get(@youtube_api_url, [], params: params)
  end

  defp parse_response(resp) do
    Poison.Parser.parse!(resp.body)
  end

  defp format_response(resp) do
    Enum.map(resp["items"], &format_video/1)
  end

  defp format_video(video) do
    %{
      "id" => %{
        "videoId" => video_id
      },
      "snippet" => %{
        "title" => title,
        "description" => description,
        "thumbnails" => %{
          "high" => %{
            "url" => thumbnail
          }
        }
      }
    } = video

    %{
       video_id: video_id,
       title: title,
       description: description,
       thumbnail: thumbnail
     }
  end

  defp config(key) do
    Application.get_env(:juicebox, Juicebox.Youtube)[key]
  end

end
