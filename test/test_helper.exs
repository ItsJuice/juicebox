ExUnit.start

Mix.Task.run "ecto.create", ~w(-r Jukebox.Repo --quiet)
Mix.Task.run "ecto.migrate", ~w(-r Jukebox.Repo --quiet)
Ecto.Adapters.SQL.begin_test_transaction(Jukebox.Repo)

