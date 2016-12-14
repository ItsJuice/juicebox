defmodule JuiceboxStream.Youtube.Client do
  @youtube_api Application.get_env(:juicebox_stream, :youtube_api)

  @search_params %{
    part: "snippet",
    safeSearch: "strict",
    type: "video",
    videoCategoryId: "10", # music
    order: "viewCount",
    videoEmbeddable: "true"
  }

  def search(query) do
    case @youtube_api.search(query, @search_params) do
      %{"items" => videos} ->
        results = fetch_video_meta_data(videos)
        |> merge_responses(videos)
        |> Enum.map(&format_video/1)

        {:ok, results}
      _ -> {:error, nil}
    end
  end

  defp merge_responses(videos_meta, videos) do
    Enum.map(videos, fn(video) ->
      meta = Enum.find(videos_meta, &(&1["id"] == video["id"]["videoId"]))

      %{
         video: video,
         meta: meta
       }
    end)
  end

  defp fetch_video_meta_data(videos) do
    Enum.map(videos, &(&1["id"]["videoId"]))
    |> @youtube_api.videos(%{ part: "contentDetails" })
    |> Map.get("items")
  end

  defp format_video(%{video: video, meta: meta}) do
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
      "contentDetails" => %{
        "duration" => duration
      }
    } = meta

    %JuiceboxStream.Youtube.Video{
       video_id: video_id,
       title: title,
       duration: JuiceboxStream.Youtube.Time.parse(duration),
       description: description,
       thumbnail: thumbnail
     }
  end
end
