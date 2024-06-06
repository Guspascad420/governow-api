/* eslint-disable */
const {
  addLeaderHandler,
  getAllLeadersHandler,
  getLeaderByIdHandler,
  editLeaderByIdHandler,
  deleteLeaderByIdHandler,
} = require('../utils/leader.handler');

const routes = [
  {
      method: 'POST',
      path: '/leaders',
      options: {
          payload: {
              output: 'stream',
              parse: true,
              allow: 'multipart/form-data',
              multipart: true,
          },
      },
      handler: addLeaderHandler,
  },
  {
      method: 'GET',
      path: '/leaders',
      handler: getAllLeadersHandler,
  },
  {
      method: 'GET',
      path: '/leaders/{id}',
      handler: getLeaderByIdHandler,
  },
  {
      method: 'PUT',
      path: '/leaders/{id}',
      handler: editLeaderByIdHandler,
  },
  {
      method: 'DELETE',
      path: '/leaders/{id}',
      handler: deleteLeaderByIdHandler,
  },
];

module.exports = routes;
