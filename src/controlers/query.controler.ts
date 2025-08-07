import {Request, Response} from 'express'
import { llmModel } from '../services/answer.services';
import { answerServices } from '../services/answer.services';

export class MainControler{
    static async processQuery(req: Request, res : Response){
        let query = req.body.query;
        const response = await new answerServices().manageSearch(query)
        res.send({
        question: query,
        message: "Success",
        response: response,
    })}

    static getConfig(req :Request, res: Response){
        res.send({
            version: "0.1v",
            llmResponse: llmModel.model.toString(),
            vectorStore: "faiss"
        })
    }

    static getStatus(req :Request, res: Response){
        res.send("Server is running")
    }
}