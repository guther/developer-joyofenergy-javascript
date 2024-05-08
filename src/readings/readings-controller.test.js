const { read, store, readWeekCost } = require("./readings-controller");
const { readingsData } = require("./readings.data");
const { readings } = require("./readings");
const { meters } = require("../meters/meters");

describe("readings", () => {
  it("should get readings with meter id from params", () => {
    const { getReadings } = readings(readingsData);
    const readingsForMeter = read(getReadings, {
      params: {
        smartMeterId: meters.METER0,
      },
    });

    expect(readingsForMeter).toEqual(readingsData[meters.METER0]);
  });

  it("should get cost for the last week", () => {
    const getReadings = () => [
      { time: 1714689742, reading: 0.37709690233957227 },
      { time: 1714699742, reading: 0.007901796236857717 },
      { time: 1714709742, reading: 0.484098684685502 },
      { time: 1714729742, reading: 0.04442196465832682 },
      { time: 1714739742, reading: 0.7902980721011796 },
    ];

    const costLastWeek = readWeekCost(getReadings, {
      params: {
        smartMeterId: meters.METER0,
      },
    });

    expect(costLastWeek).toEqual(0.26212575692637513);
  });

  it("should store readings with meter id and readings from body", () => {
    const { setReadings, getReadings } = readings(readingsData);

    const originalLength = getReadings(meters.METER0).length;

    const fixture = {
      smartMeterId: meters.METER0,
      electricityReadings: [
        {
          time: 981438113,
          reading: 0.0503,
        },
        {
          time: 982087047,
          reading: 0.0213,
        },
      ],
    };

    store(setReadings, {
      body: fixture,
    });

    const newLength = getReadings(meters.METER0).length;

    expect(originalLength + 2).toEqual(newLength);
  });
});
