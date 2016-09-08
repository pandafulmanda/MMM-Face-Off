'use strict';
const NodeHelper = require('node_helper');
const PythonShell = require('python-shell');

var pythonStarted = false;

const nodeToPython = NodeHelper.create({
  startPython: function(){
    const module = this;

    const pythonShell = new PythonShell('mm_facerec.py', {
      mode: 'json',
      // args: [JSON.stringify(module.config)],
      pythonPath: '/home/pi/.virtualenvs/cv/bin/python',
      scriptPath: '/home/pi/facerec/py/apps/videofacerec'
    });

    pythonStarted = true;

    pythonShell.on('message', function(message){
      console.log(message);
      if(message.error){
        console.log(message.error)
      }

      if(message.status){
        console.log(message.status.message);
        module.sendSocketNotification('status', message.status);
      }

      if(message.change){
        module.sendSocketNotification('change', message.change); 
      }

    });

    pythonShell.end(function(err){
      if (err) throw err;
    });

  },

  socketNotificationReceived: function(notification, payload){
    if(notification === 'CONFIG') {
      this.config = payload;

      if(!pythonStarted){
        this.startPython();
      }
    }
  }

});

module.exports = nodeToPython;
