const { usageIntervalFromPreviousWeek } = require("../usage/usage-interval");
const { meterPricePlanMap } = require("../meters/meters");
const { usageCost } = require("../usage/usage");

const read = (getData, req) => {
  const meter = req.params.smartMeterId;
  return getData(meter);
};

const readWeekCost = (getData, req) => {
  const meter = req.params.smartMeterId;
  const readings = read(getData, req);
  const { start, end } = usageIntervalFromPreviousWeek();

  const filtered = readings.filter(
    (reading) => reading.time >= start && reading.time <= end
  );

  const pricePlanMap = meterPricePlanMap[meter];

  const cost = usageCost(filtered, pricePlanMap.rate);

  return cost;
};

const store = (setData, req) => {
  const data = req.body;
  return setData(data.smartMeterId, data.electricityReadings);
};

module.exports = { read, readWeekCost, store };
