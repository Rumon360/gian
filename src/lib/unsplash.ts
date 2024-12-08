import axios from "axios";

export const getUnsplashImage = async (query: string) => {
  const client_id = process.env.UNSPLASH_API_KEY!;

  const { data } = await axios.get(
    `https://api.unsplash.com/search/photos?per_page=1&query=${query}&client_id=${client_id}`
  );

  return data.results[0].urls.small;
};
