import express from 'express'
import cors from 'cors'
import 'dotenv/config';
import authRouter from './routes/auth.routes.js'

const app = express()
const PORT = 3000

app.use(cors())
app.use(express.json())

app.use("/auth", authRouter)

app.listen(PORT, () => {
  console.log("Servidor arriba")
})
