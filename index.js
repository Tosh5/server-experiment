const express = require('express')
const app = express()
const http = require('http')
const {Server} = require('socket.io')
const cors = require('cors')
app.use(cors())
const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: ["https://cheer-app3.vercel.app", "http://localhost:3000"],
        methods: ['GET', 'POST']
    }
})

const index_bin_size = 5 // 本番運用前に、パラメータ調整が必要

const posiIndex_bin = [...Array(index_bin_size)].map((_, i) => i);
for (var i = 0; i < index_bin_size; i++){
    posiIndex_bin[i] = 0;  // 0 で初期化
}

const negIndex_bin = [...Array(index_bin_size)].map((_, i) => i);
for (var i = 0; i < index_bin_size; i++){
    negIndex_bin[i] = 0;  // 0 で初期化
}


// let total_bin = 0
let isGameActive = false // 管理画面にてStartシグナルが出てから制限時間が残っている間のみTrue
let posiScore = 0
let negScore = 0
let posiIndex = 0
let negIndex = 0
let timeRemain = '-'


io.on("connection", (socket) =>{
    console.log(`User Connected: ${socket.id}`)

    socket.on("send_start", (data)=>{

        const gameStartCount = async () =>{
            timeRemain = 10
            socket.emit('time_remain', timeRemain);
            await new Promise(s => setTimeout(s, 1000))
            timeRemain = 9
            socket.emit('time_remain', timeRemain);
            await new Promise(s => setTimeout(s, 1000))
            timeRemain = 8
            socket.emit('time_remain', timeRemain);
            await new Promise(s => setTimeout(s, 1000))
            timeRemain = 7
            socket.emit('time_remain', timeRemain);
            await new Promise(s => setTimeout(s, 1000))
            timeRemain = 6
            socket.emit('time_remain', timeRemain);
            await new Promise(s => setTimeout(s, 1000))
            timeRemain = 5
            socket.emit('time_remain', timeRemain);
            await new Promise(s => setTimeout(s, 1000))
            timeRemain = 4
            socket.emit('time_remain', timeRemain);
            await new Promise(s => setTimeout(s, 1000))
            timeRemain = 3
            socket.emit('time_remain', timeRemain);
            await new Promise(s => setTimeout(s, 1000))
            timeRemain = 2
            socket.emit('time_remain', timeRemain);
            await new Promise(s => setTimeout(s, 1000))
            timeRemain = 1
            socket.emit('time_remain', timeRemain);
            await new Promise(s => setTimeout(s, 1000))
            timeRemain = 'Start'
            socket.emit('time_remain', timeRemain);
            await new Promise(s => setTimeout(s, 1000))
            isGameActive = true

            for (let time = 60; time >= 0; time--) {
                timeRemain = time
                socket.emit("time_remain", time);
                console.log(timeRemain)
                await new Promise(s => setTimeout(s, 1000))
            }
            isGameActive = false
            posiIndex = 0
            negIndex = 0
            timeRemain = '終了です'
        }
        gameStartCount()
        
    })

    socket.on("send_myPosiIndex", (data)=>{
        if (isGameActive){
            console.log(data)
            data = Number(data)
            posiIndex_bin.splice(0,1);
            posiIndex_bin.push(data)
            // console.log(posiIndex_bin)

            posiScore += data
            let sum = 0;
    
            // 総和を取得
            for (let i = 0; i < posiIndex_bin.length; i++) {
                sum += posiIndex_bin[i];
            }
            console.log(`sum is: ${sum}`)
            let preGeneIndex = sum / posiIndex_bin.length

            // console.log(preGeneIndex)
            let geneIndex = Math.round(preGeneIndex)

            posiIndex = geneIndex

            console.log(`posi_index ${geneIndex}`)

            socket.emit("posi_index", posiIndex);
            socket.emit("posi_score", Math.round(posiScore/1000));
        }else{
            socket.emit("gene_index", '終了')
        }
    })



    socket.on("send_myNegIndex", (data)=>{
        if (isGameActive){
            data = Number(data) * 0.8
            negIndex_bin.splice(0,1);
            negIndex_bin.push(data)
            // console.log(negIndex_bin)

            negScore += data
            let sum = 0;
    
            // 総和を取得
            for (let i = 0; i < negIndex_bin.length; i++) {
                sum += negIndex_bin[i];
            }
            console.log(`sum is: ${sum}`)
            let preGeneIndex = sum / negIndex_bin.length

            // console.log(preGeneIndex)
            let geneIndex = Math.round(preGeneIndex)

            negIndex = geneIndex
            console.log(`negIndex : ${negIndex}`)

            socket.emit("neg_index", negIndex);
            socket.emit("neg_score", Math.round(negScore/1000));
        }else{
            socket.emit("gene_index", '終了')
        }
    })

    socket.on("receive_params", (data)=>{
        socket.emit("neg_index", negIndex);
        socket.emit("neg_score", Math.round(negScore/1000));
        socket.emit("posi_index", posiIndex);
        socket.emit("posi_score", Math.round(posiScore/1000));
        socket.emit('time_remain', timeRemain);
    })

    socket.on('reset_params' ,(data)=>{
        negIndex = 0,
        posiIndex = 0,
        posiScore = 0,
        negScore = 0,
        isGameActive = false,
        timeRemain = '-'
    })
})

server.listen(process.env.PORT || 8000, () =>{
    console.log('server started')
})

app.get('/', (req, res) => {
    res.send('hello world')
  })