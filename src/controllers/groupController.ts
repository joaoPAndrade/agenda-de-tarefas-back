import { Request, Response } from 'express';
import groupService from '../services/groupService';

class GroupController {

    public async getGroup (req: Request, res: Response): Promise<void> {

        const groups = await groupService.getAllGroups();
        res.status(200).send(groups);

    }

    public async getGroupById (req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        const intId = parseInt(id);

        if(isNaN(intId)){
            res.status(400).send({error : 'Invalid group ID'});
            return
        }

        const result = await groupService.getGroupById(intId);

        if(result.error){
            res.status(400).send({error: result.error});
        } else {
            res.status(200).send(result.group);
        }
    }

    public async getParticipantsByGroup(req: Request, res: Response){

        const { id } = req.params;
        const idInt = parseInt(id);

        groupService.getGroupById(idInt);

        groupService.getParticipantsByGroup(idInt);

    }

    public async createGroup(req: Request, res: Response): Promise<void> {

        const groupData = req.body
        
        const result = await groupService.createGroup(groupData);

        if(result.error){
            res.status(400).send({error: result.error})
        }else {
            res.status(201).send({group: result.group, token:result.token});
        }


    }

    public async updateGroup(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        const intId = parseInt(id);
        const groupData = req.body;

        if(isNaN(intId)){
            res.status(400).send({error : 'Invalid group ID'});
            return
        }

        const result = await groupService.updateGroup(intId, groupData);

        if(result.error) {
            res.status(400).send({ error: result.error });
        } else {
            res.status(200).send(result.group);
        }
            
    }

    public async deleteGroup(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        const intId = parseInt(id);

        const result = await groupService.deleteGroup(intId);

        if(result.error){
            res.status(500).send({ error: result.error });
        } else {
            res.status(200).send({ message: 'Group deleted successfully' });
        }
    }
}

export default new GroupController();





