import axios from "axios";
import { YoutubeTranscript } from "youtube-transcript";

export const searchYoutube = async (query: string) => {
  try {
    query = encodeURIComponent(query);
    const { data } = await axios.get(
      `https://www.googleapis.com/youtube/v3/search?key=${process.env.YOUTUBE_API_KEY}&q=${query}&videoDuration=medium&videoEmbeddable=true&type=video&maxResults=2`
    );
    if (!data) {
      return null;
    }
    if (data.items[0] === undefined) {
      return null;
    }

    return data.items[0].id.videoId;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getTranscript = async (videoId: string) => {
  try {
    const transcript = await YoutubeTranscript.fetchTranscript(videoId, {
      lang: "en",
    });
    return transcript.map((t) => t.text).join("\n");
  } catch (error) {
    console.log(error);

    return "";
  }
};
