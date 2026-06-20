import { io, Socket } from 'socket.io-client';
import { getApiUrl, getAuthToken } from '../config';
import { AgentStatus, CommitEvent } from '../shared/types';

export class CloudConnector {
  private socket: Socket | null = null;
  private connected: boolean = false;

  connect(): void {
    const token = getAuthToken();
    if (!token) {
      console.log('No auth token configured. Running in offline mode.');
      return;
    }

    try {
      this.socket = io(getApiUrl(), {
        auth: { token },
        transports: ['websocket', 'polling'],
      });

      this.socket.on('connect', () => {
        this.connected = true;
        console.log('Connected to AutoDev cloud');
      });

      this.socket.on('disconnect', () => {
        this.connected = false;
        console.log('Disconnected from AutoDev cloud');
      });

      this.socket.on('command', (data: any) => {
        console.log('Received command:', data);
      });

      this.socket.on('connect_error', (err: Error) => {
        console.warn(`Cloud connection failed: ${err.message}. Running offline.`);
        this.connected = false;
      });
    } catch (err: any) {
      console.warn(`Failed to initialize cloud connector: ${err.message}`);
      this.connected = false;
    }
  }

  sendCommit(event: CommitEvent): void {
    if (this.connected && this.socket) {
      this.socket.emit('commit', event);
    }
  }

  sendStatus(status: AgentStatus): void {
    if (this.connected && this.socket) {
      this.socket.emit('status', status);
    }
  }

  isConnected(): boolean {
    return this.connected;
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.connected = false;
  }
}
