defmodule Juicebox.Youtube.API do

  def search(query) do
    params = Map.merge(config(:search_params), %{
    })

  end

  defp config(key) do
  end
end
