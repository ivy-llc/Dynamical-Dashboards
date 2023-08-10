let priority_connection;

function setConnection(connection) {
  priority_connection = connection;
}

module.exports = {
  getConnection: function () {
    return priority_connection;
  },
  setConnection,
};
