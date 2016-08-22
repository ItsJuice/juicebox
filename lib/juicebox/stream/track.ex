defmodule Juicebox.Stream.Track do
  defstruct video: %Juicebox.Youtube.Video{},
            track_id: nil,
            votes: 0
end
