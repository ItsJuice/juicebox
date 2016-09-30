defmodule Juicebox.Endpoint do
  use Phoenix.Endpoint, otp_app: :juicebox


  # Serve at "/" the static files from "priv/static" directory.
  #
  # You should set gzip to true if you are running phoenix.digest
  # when deploying your static files in production.
  plug Plug.Static,
    at: "/", from: :juicebox, gzip: false,
    only: ~w(css fonts images js favicon.ico robots.txt)

  # Code reloading can be explicitly enabled under the
  # :code_reloader configuration of your endpoint.
  if code_reloading? do
  end


  plug Plug.Parsers,
    parsers: [:urlencoded, :multipart, :json],
    json_decoder: Poison


  plug Plug.Session,
    store: :cookie,
    key: "_juicebox_key",
    signing_salt: "QPYfeVPQ"

  plug Juicebox.Router
end
