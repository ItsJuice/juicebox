defmodule Juicebox.StreamChannel do
  use Phoenix.Channel



  def join("stream:" <> stream_id, _params, socket) do
  end

  def handle_in("video.added", %{"video_id" => video_id}, socket) do
    IO.puts "video.added: #{video_id}"

    video = VideoServices.find_or_create( %{video_id: video_id} )

    changeset = Video.increment_queued_count_changeset(video)

    case Repo.update(changeset) do
      {:ok, video} ->
        broadcast! socket, "video.added", %{ video_id: video.video_id, queued_count: video.queued_count }
    end
  end

  def handle_out("video.added", payload, socket) do

  end
end
