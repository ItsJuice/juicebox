defmodule JuiceboxWeb.Repo.Migrations.CreateVideos do
  use Ecto.Migration

  def change do
    create table(:videos) do
      add :video_id, :string
      add :queued_count, :integer
      timestamps
    end
    create index(:videos, [:video_id])
  end
end
