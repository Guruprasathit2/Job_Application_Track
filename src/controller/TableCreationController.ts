import * as fs from 'fs';
import * as path from 'path';
import { env } from '../env';
import * as bcrypt from 'bcryptjs';
import { Role } from '../model/Role';
import { User } from '../model/User';
import { DbConnection } from '../common/DBConfig';

export class TableCreationController {
    static async tableCreation(request: any, response: any) {
        try {
            const queryPath = path.resolve(process.cwd(), 'src/sql/query.sql');
            const sqlQuery = fs.readFileSync(queryPath, 'utf8');
            await DbConnection.query(sqlQuery);

            const adminRole = await DbConnection.getRepository(Role).findOne({
                select: ['id'],
                where: {
                    roleSlug: env.role.admin,
                    isActive: 1,
                },
            });
            if (!adminRole) {
                return response.status(400).send({
                    status: 0,
                    message: 'Admin role not found.',
                });
            }

            const newUser = new User();
            newUser.userName = env.userData.name;
            newUser.emailId = env.userData.email;
            newUser.password = await bcrypt.hash(env.userData.password, 10);
            newUser.phoneNumber = env.userData.phone;
            newUser.roleId = adminRole.id;
            await DbConnection.getRepository(User).save(newUser);

            return response.status(200).send({
                status: 1,
                message: 'Tables created successfully!'
            });
        } catch (err: any) {
            console.error('Error: ', err);
            return response.status(500).send({
                status: 0,
                message: 'Could not create the table........',
            });
        }   
    }
}

function createSlug(text: string) {
    return text.toString().toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '').replace(/\-\-+/g, '-');
}


// drop table tbl_role;
// drop table tbl_company;
// drop table tbl_education;
// drop table tbl_experience;
// drop table tbl_job_applied;
// drop table tbl_job_skill;
// drop table tbl_login_audit_log;
// drop table tbl_user_token;
// drop table tbl_staff_details;
// drop table tbl_job;
// drop table tbl_user;