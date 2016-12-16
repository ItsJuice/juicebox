defmodule JuiceboxStream.Youtube.TimeTests do
  use ExUnit.Case, async: true
  alias JuiceboxStream.Youtube.Time

  test ".parse/1" do
    assert Time.parse("PT30S") == 30
    assert Time.parse("PT2M30S") == 150
    assert Time.parse("PT1H2M30S") == 3750
    assert Time.parse("P2DT1H2M30S") == 176550
  end
end
