defmodule JuiceboxWeb.Presence do
  use Phoenix.Presence, otp_app: :juicebox_web,
                        pubsub_server: JuiceboxWeb.PubSub
end
