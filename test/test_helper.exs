{:ok, _} = Application.ensure_all_started(:hound)
ExUnit.configure formatters: [JUnitFormatter, ExUnit.CLIFormatter]
ExUnit.start

Ecto.Adapters.SQL.Sandbox.mode(Juicebox.Repo, :manual)

{:ok, _} = Application.ensure_all_started(:ex_machina)
