const socketIo = require('socket.io');

const { Op } = require('sequelize');
const { SYS_Configuration, SYS_Notification } = require('../models');

const initializeSocketIO = async (server) => {
  const CLIENT_URL = await SYS_Configuration.findOne({ where: { name: 'Client URL' } });
  const io = socketIo(server, {
    cors: {
      origin: CLIENT_URL?.value ? CLIENT_URL.value : '*',
    },
  });

  // Register the connection event
  io.on('connection', (socket) => {
    console.log('WebSocket connected', socket.id);

    // * Need More Thinking to make it dynamic
    // to join admins websocket channel room
    // socket.on('joinMainRoom', async (roleName) => {
    //   try {
    //     if (roleName?.includes('Participant')) {
    //       socket.join('');
    //     }
    //   } catch (error) {
    //     console.log(error);
    //     console.log('Error Joining Main / Admin Room');
    //   }
    // });

    socket.on('updateNotifications', async (notifications) => {
      try {
        if (notifications?.length > 0) {
          await SYS_Notification.update(
            { read: true },
            {
              where: {
                id: { [Op.in]: notifications },
              },
            },
          );

          console.log('Success Updating Notification Read Status');
        }
        console.log('Failed Updating Notification Read Status');
      } catch (error) {
        console.log(error);
        console.log('Error Updating User Notification');
      }
    });

    socket.on('disconnect', (reason) => console.log('WebSocket disconnected:', reason));

    socket.on('error', (error) => console.error('WebSocket error:', error));
  });

  return io;
};

module.exports = {
  initializeSocketIO,
};
