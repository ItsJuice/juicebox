defmodule Juicebox.Factory do
  # with Ecto
  use ExMachina.Ecto, repo: Juicebox.Repo

  def factory(:video) do
    %Juicebox.Video {
      queued_count: 0
    }
  end
end