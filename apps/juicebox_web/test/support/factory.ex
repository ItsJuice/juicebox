defmodule JuiceboxWeb.Factory do
  # with Ecto
  use ExMachina.Ecto, repo: JuiceboxWeb.Repo

  def video_factory do
    %JuiceboxWeb.Video {
      queued_count: 0
    }
  end
end
