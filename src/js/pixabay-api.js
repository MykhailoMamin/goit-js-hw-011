import axios from "axios";
export { getImages };

const apiKey = "39074092-1de595f7748cd839e3af14b59"
const BASE_URL = "https://pixabay.com/api/";

const getImages = async (item, page) => {
    const response = await axios.get(BASE_URL, {
    params: {
        key: apiKey,
        q: item,
        image_type: "photo",
        orientation: "horizontal",
        safesearch: true,
        page,
        per_page: 40,
    }
    })
    const { hits, totalHits } = response.data 
    return {
        hits,
        totalHits,
    }
}