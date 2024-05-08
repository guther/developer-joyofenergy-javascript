const { pricePlans } = require("./price-plans");
const { usageForAllPricePlans } = require("../usage/usage");

const recommend = (getReadings, req) => {
  const meter = req.params.smartMeterId;
  const pricePlanComparisons = usageForAllPricePlans(
    pricePlans,
    getReadings(meter)
  ).sort((a, b) => extractCost(a) - extractCost(b));
  if ("limit" in req.query) {
    return pricePlanComparisons.slice(0, req.query.limit);
  }
  return pricePlanComparisons;
};

const extractCost = (cost) => {
  // const [, value] = Object.entries(cost).find( ([key]) => key in pricePlans)
  // return value

  // performance: https://www.measurethat.net/Benchmarks/Show/3685/0/objectentries-vs-objectkeys-vs-objectkeys-with-extra-ar
  const key = Object.keys(cost).find((key) => key in pricePlans);
  return cost[key];
};

const compare = (getData, req) => {
  const meter = req.params.smartMeterId;
  const pricePlanComparisons = usageForAllPricePlans(
    pricePlans,
    getData(meter)
  );
  return {
    smartMeterId: req.params.smartMeterId,
    pricePlanComparisons,
  };
};

module.exports = { recommend, compare };
