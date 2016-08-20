defmodule Juicebox.VideoTests do
  use Juicebox.ModelCase, async: true

  test "increment_queued_count_changeset increments the video queued count by 1" do
    subject =
      insert(:video, %{queued_count: 2})
      |> Juicebox.Video.increment_queued_count_changeset
      |> Juicebox.Repo.update

    case subject do
      {:ok,    video} -> assert(video.queued_count == 3)
      {:error, error} -> flunk(error)
    end
  end
end
