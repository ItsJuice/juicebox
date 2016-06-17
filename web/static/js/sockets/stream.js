import { Socket } from 'phoenixjs';

let socket = new Socket('/stream');

socket.connect();

export default socket;
