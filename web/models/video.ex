defmodule Juicebox.Video do
  use Ecto.Schema
  import Ecto.Changeset

  schema "videos" do
    field :video_id, :string
    field :queued_count, :integer, default: 0
    timestamps
  end

  def increment_queued_count_changeset(%Juicebox.Video{} = video) do
    video
    |> cast(%{queued_count: (video.queued_count+1)}, ~w(queued_count), ~w())
  end
end
