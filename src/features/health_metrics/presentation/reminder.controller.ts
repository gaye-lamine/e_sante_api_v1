import { Request, Response, NextFunction } from 'express';
import { ReminderService } from '../application/reminder.service';
import { AppError } from '../../../shared/errors/app-error';

export class ReminderController {
    constructor(private reminderService: ReminderService) { }

    create = async (req: Request, res: Response, Next: NextFunction) => {
        try {
            const userId = (req as any).user.id;
            const reminder = await this.reminderService.createReminder({
                ...req.body,
                userId
            });
            res.status(201).json(reminder);
        } catch (error) {
            Next(error);
        }
    };

    getByUser = async (req: Request, res: Response, Next: NextFunction) => {
        try {
            const userId = (req as any).user.id;
            const reminders = await this.reminderService.getRemindersByUser(userId);
            res.json(reminders);
        } catch (error) {
            Next(error);
        }
    };

    delete = async (req: Request, res: Response, Next: NextFunction) => {
        try {
            const userId = (req as any).user.id;
            const id = req.params.id as string;
            await this.reminderService.deleteReminder(id, userId);
            res.status(204).send();
        } catch (error) {
            Next(error);
        }
    };

    toggle = async (req: Request, res: Response, Next: NextFunction) => {
        try {
            const userId = (req as any).user.id;
            const id = req.params.id as string;
            const reminder = await this.reminderService.toggleReminder(id, userId);
            res.json(reminder);
        } catch (error) {
            Next(error);
        }
    };
}
