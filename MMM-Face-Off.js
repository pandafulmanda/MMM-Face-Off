

Module.register('MMM-Face-Off', {

  defaults: {
    user: ''
  },

  socketNotificationReceived: function(notification, payload){
    if(!payload){
      return;
    }

    if(payload.face_count === 0){
      this.config.user = '';
    } else if(payload.face_count === 1) {
      this.config.user = 'Human';
    } else if(payload.face_count > 1) {
      this.config.user = 'humans';
    }

    if(payload.user){
      this.config.user = payload.user;
    }

    if(payload.message){
      Log.log('getting status');
      this.faceOffStatus = payload.message;
    } else if(notification === 'status'){
      this.faceOffStatus = payload;
    }
    this.updateDom();
  },

  start: function() {
    this.currentPerson = null;

    this.sendSocketNotification('CONFIG', this.config);
    Log.info('Starting module: ', this.name);
  },

  getDom: function() {
    var wrapper = document.createElement('div');
    var greetingDOM = document.createElement('p');
    var statusDOM = document.createElement('i');

    var greeting = ['Greetings'];

    if(this.config.user.length > 0) {
      greeting.push(this.config.user);
    }

    greetingDOM.innerText = greeting.join(', ') + '!';
    wrapper.appendChild(greetingDOM);

    if(this.faceOffStatus){
      statusDOM.innerText = JSON.stringify(this.faceOffStatus);
      wrapper.appendChild(statusDOM);
    }
 
    return wrapper;
  }
});


