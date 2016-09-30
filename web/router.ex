defmodule Juicebox.Router do
  use Juicebox.Web, :router

  pipeline :browser do
    plug :fetch_session
    plug :fetch_flash
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/api", Juicebox do
    pipe_through :api

    get "/videos", ApiController, :videos
  end

  scope "/", Juicebox do
    pipe_through :browser # Use the default browser stack

    get "/", PageController, :index
  end

  # Other scopes may use custom stacks.
  # scope "/api", Juicebox do
  #   pipe_through :api
  # end
end
