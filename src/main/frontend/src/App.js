import React, { useState, useEffect, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

const App = () => {
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [connected, setConnected] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState('');
  const [roomName, setRoomName] = useState(''); // 채팅방 이름 상태 추가
  const [error, setError] = useState(''); // 에러 메시지 상태 추가
  const websocket = useRef(null);

  useEffect(() => {
    fetch('/rooms')
        .then((response) => response.json())
        .then((data) => setRooms(data));
  }, []);

  const handleMessageReceive = (event) => {
    const newMessage = event.data;
    if (newMessage === "이미 해당 이름은 사용되고 있습니다.") {
      setError(newMessage);
      websocket.current.close();
      return;
    }
    if (!newMessage.startsWith('(시스템)')) {
      setChatMessages((prevMessages) => [...prevMessages, newMessage]);
    }
  };

  const handleOpen = () => {
    const msg = `(시스템) *${username}가 ${roomName} 채팅방에 입장하셨습니다*`;
    setChatMessages((prevMessages) => [...prevMessages, msg]);
    setConnected(true);
  };

  const handleClose = () => {
    setChatMessages((prevMessages) => [...prevMessages, `(시스템) ${roomName} 채팅방 연결이 종료되었습니다`]);
    setConnected(false);
  };

  const sendMessage = () => {
    if (message) {
      const msg = `${username}: ${message}`;
      websocket.current.send(msg);
      setMessage('');
    }
  };

  const leaveChat = () => {
    if (websocket.current) {
      const msg = `(시스템) *${username}가 ${roomName} 채팅방에서 나갔습니다*`;
      websocket.current.send(msg);
      websocket.current.close();
      setChatMessages((prevMessages) => [...prevMessages, msg]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(''); // 에러 메시지 초기화
    websocket.current = new WebSocket(`ws://localhost:8080/ws/chat/${selectedRoom}?username=${username}`);
    websocket.current.onmessage = handleMessageReceive;
    websocket.current.onopen = handleOpen;
    websocket.current.onclose = handleClose;
  };

  const createRoom = (e) => {
    e.preventDefault();
    const newRoomName = prompt("새로운 채팅방 이름을 입력하세요:");
    if (newRoomName) {
      fetch(`/rooms?name=${newRoomName}`, { method: 'POST' })
          .then((response) => {
            if (!response.ok) {
              return response.text().then(text => { throw new Error(text) });
            }
            return response.json();
          })
          .then((newRoom) => {
            setRooms((prevRooms) => [...prevRooms, newRoom]);
            setError(''); // 에러 메시지 초기화
          })
          .catch((err) => {
            setError(err.message); // 에러 메시지 설정
          });
    }
  };

  useEffect(() => {
    return () => {
      if (websocket.current) {
        websocket.current.close();
      }
    };
  }, []);

  return (
      <div className="container mt-5">
        {!connected ? (
            <div className="card p-4 shadow">
              {error && <div className="alert alert-danger" role="alert">{error}</div>}
              <form onSubmit={handleSubmit} className="mb-3">
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">닉네임 입력:</label>
                  <input
                      type="text"
                      className="form-control"
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="room" className="form-label">채팅방 선택:</label>
                  <select
                      className="form-select"
                      id="room"
                      value={selectedRoom}
                      onChange={(e) => {
                        setSelectedRoom(e.target.value);
                        const room = rooms.find(r => r.roomId === e.target.value);
                        setRoomName(room ? room.name : '');
                      }}
                      required
                  >
                    <option value="">채팅방을 선택하세요</option>
                    {rooms.map((room) => (
                        <option key={room.roomId} value={room.roomId}>{room.name}</option>
                    ))}
                  </select>
                </div>
                <div className="d-flex justify-content-between">
                  <button className="btn btn-secondary" onClick={createRoom}>새로운 채팅방 만들기</button>
                  <button type="submit" className="btn btn-primary">채팅방 입장</button>
                </div>
              </form>
            </div>
        ) : (
            <div className="card p-4 shadow">
              <button className="btn btn-secondary mb-3" onClick={leaveChat}>채팅방 나가기</button>
              <div className="chat-box col-12">
                <div className="room-name">{roomName}</div> {/* 채팅방 이름 표시 */}
                <div id="msgArea" className="chat-area">
                  {chatMessages.map((msg, index) => (
                      <div key={index} className="chat-message">
                        {!msg.startsWith('(시스템)') && <img src="/maha.jpg" alt="User" />}
                        <span>{msg}</span>
                      </div>
                  ))}
                </div>
                <div className="input-group mb-3 mt-3">
                  <input
                      type="text"
                      id="msg"
                      className="form-control"
                      placeholder="메세지 입력하세요"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      aria-label="Message"
                  />
                  <button className="btn btn-outline-secondary" type="button" onClick={sendMessage}>전송</button>
                </div>
              </div>
            </div>
        )}
      </div>
  );
};

export default App;





