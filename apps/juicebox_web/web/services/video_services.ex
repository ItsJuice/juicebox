defmodule JuiceboxWeb.VideoServices do
  import Ecto.Query

  alias JuiceboxWeb.Repo
  alias JuiceboxWeb.Video

  def find_or_create(%{video_id: video_id} = video) do
    case Repo.get_by(Video, %{video_id: video_id}) do
      %Video{} = video -> video
      nil              -> create(video)
    end
  end

  def create(video) do
    Repo.insert(%Video{video_id: video.video_id})
  end
end