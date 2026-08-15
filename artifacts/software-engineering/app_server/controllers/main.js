/* GET Homepage */
exports.index = function(req, res) {
  res.render('index', { title: 'Express' });
};

module.exports = {
  index: exports.index
};