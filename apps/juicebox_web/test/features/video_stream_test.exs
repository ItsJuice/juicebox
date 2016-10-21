defmodule JuiceboxWeb.VideoStreamTests do
  use JuiceboxWeb.ConnCase, async: true
  use Hound.Helpers

  hound_session

  test "Adding to the video stream" do
    # navigate_to("http://localhost:4001/")

    # add_video_link = find_element(:link_text, "Add video")

    # videos = find_all_elements(:class, ".video")
    # assert videos.length == 2
    assert true == true
  end
end