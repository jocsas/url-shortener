import { Request, response, Response } from "express";
import shortId from 'shortid'
import { config } from "../config/Constants";
import { URLModel } from "../database/model/URL";

export class URLController {
    public async shorten(req: Request, res: Response): Promise<void>{
        // Ver se url já existe
        const { originURL } = req.body
        const url = await URLModel.findOne({ originURL })
        if (url) {
            res.json(url)
            return
        }
        
        // Criar hash para essa URL
        const hash = shortId.generate()
        const shortURL = `${config.API_URL}/${hash}`
        const newURL = await URLModel.create({hash, shortURL, originURL})
        res.json(newURL)
        
        
    }
    
    public async redirect(req: Request, res: Response): Promise<void>{
        // Pegar hash da URL
        const {hash} = req.params
        const url = await URLModel.findOne({ hash })
        // Encontrar URL original pelo hash
        if(url){
            res.redirect(url.originURL)
            return
        }

        res.status(400).json('Url not found')
    }
}