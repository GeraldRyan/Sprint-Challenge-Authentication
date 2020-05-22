
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {username: 'james', password:"voice"},
        {username: 'lars', password:"drums"},
        {username: 'kirk', password:'guitar'},
        {username: 'cliff', password:'goodbye'}
      ]);
    });
};
