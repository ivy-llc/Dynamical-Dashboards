// The cache object should store both the data and the timestamp of when it was fetched.
let cache = {
  data: {},
  fetchTimestamp: null,
};

function setData(newData) {
  cache = {
    data: newData,
    fetchTimestamp: Date.now(),
  };
}

module.exports = {
  getCache: function () {
    return cache.data;
  },
  setCache: setData,
};
