defmodule JuiceboxStream.Youtube.API do
  import HTTPoison

  @spec search(String.t, map) :: [map]
  def search(query, params \\ %{}) do
    params =  Map.put(params, :q, query)
    call("/search", params)
    |> parse_response
  end

  @spec videos([String.t], map) :: [map]
  def videos(ids, params \\ %{}) do
    params = Map.put(params, :id, Enum.join(ids, ","))
    call("/videos", params)
    |> parse_response
  end

  defp call(endpoint, params) do
    params = Map.put(params, :key, config(:api_key))
    HTTPoison.get(config(:api_url) <> endpoint, [], params: params)
  end

  defp config(key) do
    Application.get_env(:juicebox_stream, JuiceboxStream.Youtube)[key]
  end

  defp parse_response({:ok, %{body: body}}) do
    Poison.Parser.parse!(body)
  end
end
