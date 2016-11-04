defmodule JuiceboxStream.Stream.Track do
  defstruct video: %JuiceboxStream.Youtube.Video{},
            track_id: nil,
            votes: 0
end
