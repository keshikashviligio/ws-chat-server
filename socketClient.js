const enterMessenger = document.querySelector('.enter-messenger');
const enterMessengerBtn = document.querySelector('#messenger-enter-btn');
const enterMessengerInput = enterMessenger.querySelector('input');
const messengerWrapper = document.querySelector('.messenger-wrapper');
const onlineUsersContainer = document.querySelector('.online-users-container');
const onlineUsers = document.querySelector('.online-users');
const messagesContainer = document.querySelector('.messenger-messages');
const messengerFrom = document.querySelector('#message-form');
const messengerInput = document.querySelector('#message-input');
const userTypingIndicator = document.querySelector('#typing-indicator');

enterMessengerBtn.addEventListener('click', e => {
  const userName = enterMessengerInput.value;
  if(!userName){
    alert('Please enter your name to access messenger');
  } else {
    enterMessenger.classList.add('entered');
    messengerWrapper.classList.add('entered');
    initMessenger(userName);
  }
});

function initMessenger(newUserName){
  const socket = new WebSocket('ws://localhost:8080');
  let tId = null;
  socket.addEventListener('open', e => {
    const newUser = { type: 'newUser', data: newUserName };
    socket.send(JSON.stringify(newUser));
  });
  socket.addEventListener('message', e => {
    const message = JSON.parse(e.data);
    if(message.type === 'newUser'){
      appendNewUser(message.data)
    }
    if(message.type === 'chatMessage'){
      appendNewMessage(message);
    }
    if(message.type === 'activeUsers'){
      appendActiveUsers(message.data);
    }
    if(message.type === 'userTyping'){
      userTypingIndicator.innerText = `${message.data} is Typing`;
      if(tId){
        clearTimeout(tId);
      }
      tId = setTimeout(() => {
        userTypingIndicator.innerText = '';
      }, 1000);
    }
    if(message.type === 'messageLike'){
      const currentMessage = document.querySelector(`[data-id="${message.id}"]`);
      if(currentMessage){
        currentMessage.querySelector('span').innerText = `Likes: ${message.likeCount}`;
      }
    }
  });

  messengerFrom.addEventListener('submit', e => {
    e.preventDefault();
    const messageValue = messengerInput.value;
    const messageData = {type: 'chatMessage', data: messageValue};
    socket.send(JSON.stringify(messageData));
    messengerInput.value = '';
  });

  messengerInput.addEventListener('input', e => {
    const messageData = {type: 'userTyping', data: newUserName};
    socket.send(JSON.stringify(messageData));
  });

  function appendNewUser(user){
    const userDiv = document.createElement('div');
    userDiv.innerText = user;
    onlineUsers.appendChild(userDiv);
  }
  function appendActiveUsers(users){
    onlineUsers.innerHTML = '';
    users.forEach(user => appendNewUser(user.data));
  }
  function appendNewMessage(message){
    const messageLikes = document.createElement('span');
    const messageDiv = document.createElement('div');
    messageDiv.innerText = message.data;
    messageDiv.setAttribute('data-id', message.id);
    messageDiv.addEventListener('click', e => {
      socket.send(JSON.stringify({ type: 'messageLike', id: message.id }));
    });
    messageDiv.appendChild(messageLikes);
    messagesContainer.appendChild(messageDiv);
  }
}
