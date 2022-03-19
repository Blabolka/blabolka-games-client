import { io } from 'socket.io-client'

const connectionUrl = process.env.SOCKET_CONNECTION_URL

const socket = connectionUrl ? io(connectionUrl) : io()

export default socket
