import { io } from 'socket.io-client'

const connectionUrl = process.env.SERVER_BASE_URL

// every time start with websocket connection first
const connectionParams = {
    transports: ['websocket' /*, 'polling'*/],
}

const socket = connectionUrl ? io(connectionUrl, connectionParams) : io(connectionParams)

// socket.on('connect_error', () => {
//     // revert to long polling if not available websocket
//     socket.io.opts.transports = ['polling', 'websocket']
// })

export default socket
