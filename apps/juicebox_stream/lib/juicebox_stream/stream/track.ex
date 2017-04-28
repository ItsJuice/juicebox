defmodule JuiceboxStream.Stream.Track do
  defstruct video: %JuiceboxStream.Youtube.Video{},
            votes: 0
end
