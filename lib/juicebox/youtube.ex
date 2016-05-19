defmodule Juicebox.Youtube do
  import HTTPotion

  def search(query) do
    make_request(query, config[:api_key])
      |> parse_response
      |> format_response
  end

  defp config do
    Application.get_env :juicebox, Juicebox.Youtube
  end

  defp make_request(query, key) do
    HTTPotion.get("https://www.googleapis.com/youtube/v3/search", [ query: %{
      q: query,
      key: key,
      part: "snippet",
      safeSearch: "strict",
      type: "video",
      videoCategoryId: "10", # music
      order: "viewCount",
      videoEmbeddable: "true"
    } ])
  end

  defp parse_response(resp) do
    Poison.Parser.parse!(resp.body)
  end

  defp format_response(resp) do
    Enum.map(resp["items"], &format_video(&1))
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
end
