defmodule Juicebox.Youtube.HTTP do
  @behaviour Juicebox.Youtube
  alias Juicebox.Youtube.Video, as: Video

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
         do: format_response(parsed)
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
        "thumbnails" => %{
          "high" => %{
            "url" => thumbnail
          }
        }
      }
    } = video

    %Video{
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
