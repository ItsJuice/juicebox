defmodule Juicebox.Youtube.API do
  import HTTPoison

  def search(query) do
    params = Map.merge(config(:search_params), %{
      q: query,
      key: config(:api_key)
    })

    HTTPoison.get(config(:api_url), [], params: params)
  end

  defp config(key) do
    Application.get_env(:juicebox, Juicebox.Youtube)[key]
  end
end
