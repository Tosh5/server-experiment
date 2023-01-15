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
let timeRemain = 'サーバ起動'


io.on("connection", (socket) =>{
    console.log(`User Connected: ${socket.id}`)

    socket.on("send_start", (data)=>{

        const gameStartCount = async () =>{
            // socket.emit("time_remain", '10');
            // await new Promise(s => setTimeout(s, 1000))
            // socket.emit("time_remain", '9');
            // await new Promise(s => setTimeout(s, 1000))
            // socket.emit("time_remain", '8');
            // await new Promise(s => setTimeout(s, 1000))
            // socket.emit("time_remain", '7');
            // await new Promise(s => setTimeout(s, 1000))
            // socket.emit("time_remain", '6');
            // await new Promise(s => setTimeout(s, 1000))
            // socket.emit("time_remain", '5');
            // await new Promise(s => setTimeout(s, 1000))
            // socket.emit("time_remain", '4');
            // await new Promise(s => setTimeout(s, 1000))
            // socket.emit("time_remain", '3');
            // await new Promise(s => setTimeout(s, 1000))
            socket.emit("time_remain", '2');
            await new Promise(s => setTimeout(s, 1000))
            socket.emit("time_remain", '1');
            await new Promise(s => setTimeout(s, 1000))
            socket.emit("time_remain", 'START');
            await new Promise(s => setTimeout(s, 1000))
            isGameActive = true
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
            data = Number(data)
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

    // let time_remain = 120

    // for (let time = 400; time >= 0; time--) {
    //     time_remain = time
    //     socket.emit("time_remain", time);

    //     const sendingParams = async () =>{
    //         socket.emit("neg_index", negIndex);
    //         socket.emit("neg_score", Math.round(negScore/1000));
    //         socket.emit("posi_index", posiIndex);
    //         socket.emit("posi_score", Math.round(posiScore/1000));
    //         await new Promise(s => setTimeout(s, 1000))
    //     }

    //     sendingParams()

        

    //     console.log(time_remain)
    //     new Promise(s => setTimeout(s, 1000))  // await new Promise(s => setTimeout(s, 1000))
    // }



    // const sendingParams = async () =>{
    //     socket.emit("neg_index", negIndex);
    //     socket.emit("neg_score", Math.round(negScore/1000));
    //     socket.emit("posi_index", posiIndex);
    //     socket.emit("posi_score", Math.round(posiScore/1000));
    //     await new Promise(s => setTimeout(s, 100))
    //     console.log(`infinite loop negIndex: ーーーーーーーーーーーーーーーーーーー ${negIndex}`)
    // }

    // sendingParams()


    // const gameStartCount = async () =>{
    //     socket.emit("total_index", '2');
    //     await new Promise(s => setTimeout(s, 1000))
    //     socket.emit("total_index", '1');
    //     await new Promise(s => setTimeout(s, 1000))
    //     socket.emit("total_index", 'START');
    //     await new Promise(s => setTimeout(s, 1000))
    //     isGameActive = true
    // }
    // gameStartCount()

    
    




    // socket.on('send_start', (msg) =>{
    //     console.log('GAME STARTED')
    //     socket.emit("total_index", '1');
    //     socket.broadcast.emit("total_index", '1');

    //     // const countDown = setInterval(() => {
    //     //     sendmyindex(myIndexRef.current)
    //     //   }, 100);

    //     const gameCount = async () =>{
    //         // socket.emit("total_index", '10');
    //         // await new Promise(s => setTimeout(s, 1000))
    //         // socket.emit("total_index", '9');
    //         // await new Promise(s => setTimeout(s, 1000))
    //         // socket.emit("total_index", '8');
    //         // await new Promise(s => setTimeout(s, 1000))
    //         // socket.emit("total_index", '7');
    //         // await new Promise(s => setTimeout(s, 1000))
    //         // socket.emit("total_index", '6');
    //         // await new Promise(s => setTimeout(s, 1000))
    //         // socket.emit("total_index", '5');
    //         // await new Promise(s => setTimeout(s, 1000))
    //         // socket.emit("total_index", '4');
    //         // await new Promise(s => setTimeout(s, 1000))
    //         // socket.emit("total_index", '3');
    //         // await new Promise(s => setTimeout(s, 1000))
    //         socket.emit("total_index", '2');
    //         await new Promise(s => setTimeout(s, 1000))
    //         socket.emit("total_index", '1');
    //         await new Promise(s => setTimeout(s, 1000))
    //         socket.emit("total_index", 'START');
    //         await new Promise(s => setTimeout(s, 1000))

    //         socket.on("send_myindex", (data)=>{
    //             // console.log(`received index: ${data}`)
    //             // let data = hisIndex
    //             // function calcHisIndex(isGameActive) {
    //             //     return (isGameActive ? hisIndex : '0');
    //             // }
    //             // let data = calcHisIndex(isGameActive)

    //             // socket.join(roomId);
    //             // console.log(`joined to ${roomId}`)

    //             if (isGameActive){
    //                 posiIndex_bin.splice(0,1);
    //                 posiIndex_bin.push(data)

    //                 total_bin += data
            
    //                 let sum = 0;
            
    //                 // 総和を取得
    //                 for (let i = 0; i < posiIndex_bin.length; i++) {
    //                     sum += posiIndex_bin[i];
    //                 }
    //                 let geneIndex = Math.round(sum / posiIndex_bin.length)
        
    //                 socket.emit("gene_index", geneIndex);
    //                 socket.emit("total_index", Math.round(total_bin/1000));
    //             }else{
    //                 socket.emit("gene_index", '終了')

    //             }
        
                
    //         })

    //         let time_remain = 120

    //         // console.log('next to loop')

    //         for (let time = 4; time >= 0; time--) {
    //             time_remain = time
    //             socket.emit("time_remain", time);
    //             console.log(time_remain)
    //             await new Promise(s => setTimeout(s, 1000))
    //         }

    //         if (time_remain <= 0){
    //             socket.emit('finish', time_remain)
    //             isGameActive = false
    //             // socket.off('send_myindex')
    //             await new Promise(s => setTimeout(s, 1000))
    //             // socket.disconnect(true);
    //         }

    //       }
    //     gameCount()

    // })
})

server.listen(process.env.PORT || 8000, () =>{
    console.log('server started')
})
