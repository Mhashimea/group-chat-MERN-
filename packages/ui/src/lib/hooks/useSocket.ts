import { useState, useEffect } from 'react';
import { Socket, io } from 'socket.io-client'; // Import Socket type if available

const useSocket = (serverUrl: string) => {
  const [socketInstance, setSocketInstance] = useState<Socket | null>(null);
  useEffect(() => {
    const socketInstance = io(serverUrl);
    setSocketInstance(socketInstance);
  }, [serverUrl]);

  return socketInstance;
};

export default useSocket;
