defmodule JuiceboxStream.Youtube.Time do

  @doc """
  Converts a Youtube duration string to seconds (integer)
  """
  def parse(duration) do
    String.split(duration, ["P","D","T","H","M","S"], trim: true)
    |> Enum.map(&String.to_integer/1)
    |> to_sec
  end

  defp to_sec([d, h, m, s]), do: to_sec([h + (d * 24), m, s])
  defp to_sec([h, m, s]),    do: to_sec([m + (h * 60), s])
  defp to_sec([m, s]),       do: to_sec([s + (m * 60)])
  defp to_sec([s]),          do: s
end
