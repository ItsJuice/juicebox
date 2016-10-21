defmodule JuiceboxWeb.Stream.Track do
  defstruct video: %JuiceboxWeb.Youtube.Video{},
            track_id: nil,
            votes: 0
end
