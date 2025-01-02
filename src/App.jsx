import React, { useState, useRef } from "react";
import Peer from "peerjs";

const PeerApp = () => {
  const [peerId, setPeerId] = useState("");
  const [remotePeerId, setRemotePeerId] = useState("");
  const [connection, setConnection] = useState(null);
  const [message, setMessage] = useState("");
  const [receivedMessage, setReceivedMessage] = useState("");
  const peerRef = useRef(null);

  const createPeer = () => {
    const peer = new Peer();

    peer.on("open", (id) => {
      console.log("My peer ID is:", id);
      setPeerId(id);
    });

    peer.on("connection", (conn) => {
      console.log("Connected to peer:", conn.peer);
      setConnection(conn);

      conn.on("data", (data) => {
        console.log("Received message:", data);
        setReceivedMessage(data);
      });
    });

    peerRef.current = peer;
  };

  const connectToPeer = () => {
    if (!remotePeerId) return;
    const conn = peerRef.current.connect(remotePeerId);

    conn.on("open", () => {
      console.log("Connection opened with:", remotePeerId);
      setConnection(conn);
    });

    conn.on("data", (data) => {
      console.log("Received message:", data);
      setReceivedMessage(data);
    });
  };

  const sendMessage = () => {
    if (connection && message) {
      connection.send(message);
      console.log("Sent message:", message);
      setMessage("");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Peer.js with React</h1>

      <button onClick={createPeer}>Create Peer</button>
      {peerId && <p>Your Peer ID: {peerId}</p>}

      <div>
        <h2>Connect to Remote Peer</h2>
        <input
          type="text"
          placeholder="Enter remote peer ID"
          value={remotePeerId}
          onChange={(e) => setRemotePeerId(e.target.value)}
        />
        <button onClick={connectToPeer}>Connect</button>
      </div>

      <div>
        <h2>Send Message</h2>
        <input
          type="text"
          placeholder="Type a message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={sendMessage}>Send</button>
      </div>

      {receivedMessage && (
        <div>
          <h3>Received Message:</h3>
          <p>{receivedMessage}</p>
        </div>
      )}
    </div>
  );
};

export default PeerApp;
