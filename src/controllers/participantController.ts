import { Request, Response } from 'express';
import participantService from '../services/participantService';

class ParticipantController {

    public async getGroupsByParticipant(req: Request, res: Response): Promise<void> {
        const { email } = req.params;

        const result = await participantService.getGroupsByParticipant(email);

        if (result.error) {
            res.status(404).json({ error: result.error });
            return;
        }

        res.status(200).json({ groups: result.groups });



    }



}

export default new ParticipantController()