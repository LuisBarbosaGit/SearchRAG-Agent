import express, {Request, Response} from 'express'


const PORT = 3000;
const app = express();
app.use(express.json)

app.listen(PORT, () => {
    console.log('Server is runnig')
})

app.post("/users", (req: Request, res : Response) => {
    let query = req.body;
    res.send({
        message: "Testando",
        search: query,
    })
})