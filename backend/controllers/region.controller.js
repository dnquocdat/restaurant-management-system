import { getRegions } from "../services/region.service.js";

const GetRegions = async (req, res) => {
  // Your logic here
  const regions = await getRegions();
  res.json(regions);
};

export { GetRegions };
