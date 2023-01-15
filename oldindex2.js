const express = require('express')
const app = express()
const http = require('http')
const {Server} = require('socket.io')
const cors = require('cors')
app.use(cors())
const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: ["https://cheer-app2.vercel.app", "http://localhost:3000"],
        methods: ['GET', 'POST']
    }
})

// const posiIo = io.of('/posi')
// const negIo = io.of('/neg')

const index_bin_size = 5 // 本番運用前に、パラメータ調整が必要

const index_bin = [...Array(index_bin_size)].map((_, i) => i);
for (var i = 0; i < index_bin_size; i++){
    index_bin[i] = 0;  // 0 で初期化
}

let total_bin = 0

let isGameActive = true


// posiIo.on('connection', socket => {
//     console.log(`connected to posiIo from ${socket.id} `)

 
// })



io.on("connection", (socket) =>{
    console.log(`User Connected: ${socket.id}`)

    socket.on('send_start', (msg) =>{
        console.log('GAME STARTED')
        socket.emit("total_index", '1');
        socket.broadcast.emit("total_index", '1');

        // const countDown = setInterval(() => {
        //     sendmyindex(myIndexRef.current)
        //   }, 100);

        const gameCount = async () =>{
            // socket.emit("total_index", '10');
            // await new Promise(s => setTimeout(s, 1000))
            // socket.emit("total_index", '9');
            // await new Promise(s => setTimeout(s, 1000))
            // socket.emit("total_index", '8');
            // await new Promise(s => setTimeout(s, 1000))
            // socket.emit("total_index", '7');
            // await new Promise(s => setTimeout(s, 1000))
            // socket.emit("total_index", '6');
            // await new Promise(s => setTimeout(s, 1000))
            // socket.emit("total_index", '5');
            // await new Promise(s => setTimeout(s, 1000))
            // socket.emit("total_index", '4');
            // await new Promise(s => setTimeout(s, 1000))
            // socket.emit("total_index", '3');
            // await new Promise(s => setTimeout(s, 1000))
            socket.emit("total_index", '2');
            await new Promise(s => setTimeout(s, 1000))
            socket.emit("total_index", '1');
            await new Promise(s => setTimeout(s, 1000))
            socket.emit("total_index", 'START');
            await new Promise(s => setTimeout(s, 1000))

            socket.on("send_myindex", (data)=>{
                // console.log(`received index: ${data}`)
                // let data = hisIndex
                // function calcHisIndex(isGameActive) {
                //     return (isGameActive ? hisIndex : '0');
                // }
                // let data = calcHisIndex(isGameActive)

                // socket.join(roomId);
                // console.log(`joined to ${roomId}`)

                if (isGameActive){
                    index_bin.splice(0,1);
                    index_bin.push(data)

                    total_bin += data
            
                    let sum = 0;
            
                    // 総和を取得
                    for (let i = 0; i < index_bin.length; i++) {
                        sum += index_bin[i];
                    }
                    let geneIndex = Math.round(sum / index_bin.length)
        
                    socket.emit("gene_index", geneIndex);
                    socket.emit("total_index", Math.round(total_bin/1000));
                }else{
                    socket.emit("gene_index", '終了')

                }
        
                
            })

            let time_remain = 120

            // console.log('next to loop')

            for (let time = 4; time >= 0; time--) {
                time_remain = time
                socket.emit("time_remain", time);
                console.log(time_remain)
                await new Promise(s => setTimeout(s, 1000))
            }

            if (time_remain <= 0){
                socket.emit('finish', time_remain)
                isGameActive = false
                // socket.off('send_myindex')
                await new Promise(s => setTimeout(s, 1000))
                // socket.disconnect(true);
            }

          }
        gameCount()

    })
})

server.listen(process.env.PORT || 8000, () =>{
    console.log('server started')
})
