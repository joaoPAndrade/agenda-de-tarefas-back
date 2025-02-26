import { Request, Response } from 'express';
import groupService from '../services/groupService';

class GroupController {

    public async getGroup (req: Request, res: Response): Promise<void> {
        console.log("2")
        const groups = await groupService.getAllGroups();
        res.status(200).send(groups);

    }

    public async getGroupById (req: Request, res: Response): Promise<void> {

        try{

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
        } catch (error){
            res.send(400).send({error: "Invalid group ID"});
        }
    }

    public async getParticipantsByGroup(req: Request, res: Response){

        const { id } = req.params;
        const idInt = parseInt(id);

        groupService.getGroupById(idInt);

        const participants = await groupService.getParticipantsByGroup(idInt);
        console.log(participants);

        if(participants.error){
            res.status(400).send({error: participants.error})
        }


        if(participants == null){
            res.status(400).send({error: "No participants found"})
        } else {
            res.status(200).send(participants);
        }

        

    }

    public async createGroup(req: Request, res: Response): Promise<void> {

        const groupData = req.body
        
        const result = await groupService.createGroup(groupData);

        if(result.error){
            res.status(400).send({error: result.error})
        }else {
            res.status(201).send({group: result.group });
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

    public async addParticipantToGroup(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        const { userEmail } = req.body;

        const result = await groupService.addParticipantToGroup(parseInt(id), userEmail);

        if(result.error){
            res.status(400).send({ error: result.error });
        } else {
            res.status(200).send({ message: 'Participant added to group' });
        }
    }

    public async removeParticipantFromGroup(req: Request, res: Response): Promise<void> {

        const { id } = req.params;
        const idInt = parseInt(id);
        const{ userEmail }= req.body;

        const result = await groupService.removeParticipantFromGroup(idInt, userEmail);

        if(result.error){
            res.status(400).send({ error: result.error });
        } else {
            res.status(200).send({ message: 'Participant removed from group' });
        }

    }

    public async getGroupByUser(req: Request, res: Response): Promise<void> {
        console.log("3")

        const { email } = req.query;

        if (typeof email !== 'string') {
            res.status(400).send({ error: 'Invalid email' });
            return;
        }

        const result = await groupService.getGroupByUser(email);
        
        if (result.error) {
            res.status(400).send({ error: result.error });
        } else {
            res.status(200).send(result.groups);
        }

    }

    public async getGroupsOwnedByUser(req: Request, res: Response): Promise<void> {
        console.log("SAdASDASD")
        const { email } = req.params;

        const result = await groupService.getGroupsOwnedByUser(email);
        console.log(result.groups?.length);
        if (result.error) {
            console.log("SAdASDASD")
            res.status(400).send({ error: result.error });
        } else {
            console.log(result.groups)
            res.status(200).send(result.groups);
        }

    }
}

export default new GroupController();





