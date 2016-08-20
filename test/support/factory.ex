defmodule Juicebox.Factory do
  # with Ecto
  use ExMachina.Ecto, repo: Juicebox.Repo

  def video_factory do
    %Juicebox.Video {
      queued_count: 0
    }
  end
end
