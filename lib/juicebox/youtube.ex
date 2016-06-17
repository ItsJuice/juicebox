defmodule Juicebox.Youtube do
  @doc "Search for videos on Youtube"
  @callback search(query :: String.t) :: %{}
end
