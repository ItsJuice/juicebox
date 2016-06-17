defmodule Juicebox.Youtube do
  @doc """
  Search for videos on Youtube
  """
  @callback search(String.t) :: [%Juicebox.Youtube.Video{}]
end
