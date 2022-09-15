import express, { Request, Response } from 'express';
const app = express();
const PORT = 3000;

app.use(express.json());

interface INewUser{
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

interface IUser extends INewUser {
    id: number;
}


const users: IUser[] = [
    {
    id: 1,
    firstName: 'Juhan',
    lastName: 'Juurikas',
    email: 'juhan@juurikas.ee',
    password: 'juhan'
    },
];


app.get('/api/v1/health', (req: Request, res: Response) => {
    res.status(200).json({
        message: 'Hello worls!',
    });
});

app.get('/api/v1/users', (req: Request, res: Response) => {
    res.status(200).json({
        success: true,
        message: 'List of users',
        users
    });
});

app.post('/api/v1/users', (req: Request, res: Response) => {
    //console.log(req.body);
    const {firstName, lastName, email, password} = req.body;
    const id = users.length + 1;
    const newUser: IUser = {
        id,
        firstName,
        lastName,
        email,
        password,
    };
    users.push(newUser);

    res.status(201).json({
        success: true,
        message: `User with email ${newUser.id} created`,//Oluline et see oleks tagurpidi ülakomade sees!!!
    });
});

app.delete('/api/v1/users:id', (req: Request, res: Response) => {
    const id = parseInt( req.params.id);
    const index = users.findIndex(element => element.id === id);
    if (!index){
        res.status(404).json({
            success: true,
            message: `User not found`,
        });
    }
    users.splice(index, 1);
    return res.status(200).json({
        success: true,
        message: `User deleted`,
    });
});

app.listen(PORT, () => {
    console.log('Server is running');
});
