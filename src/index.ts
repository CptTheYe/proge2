import express, { Request, Response } from 'express';
const app = express();
const PORT = 3000;

app.use(express.json()); //Middleware

//Massiivi formaadi määramine. Need on näiteks APIsse kasutajate üles laadimisel kohustuslikud väljad:
interface INewUser{
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

//Massiivile iNewUser'ile ID määramine. Nii tegemine laiendab teist interface'i, aga ei muuda seda vanadele kasutajatele.
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

//API töötamise kontroll
app.get('/api/v1/health', (req: Request, res: Response) => {
    res.status(200).json({
        message: 'Hello world!',
    });
});

//API kõikide kasutajate listi päring
app.get('/api/v1/users', (req: Request, res: Response) => {
    res.status(200).json({
        success: true,
        message: 'List of users',
        users
    });
});

//Kindla kasutaja pärimine ID järgi
app.get('/api/v1/users/:id', (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const user = users.find(element => {
        return element.id === id;
    });
    if (!user) {
        return res.status(404).json({
            success: false,
            message: 'User not found',
        });
    };
    return res.status(200).json({
        success: true,
        message: 'User',
        data: {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
        }
    });
});

//Kasutaja muutmine
app.patch('/api/v1/users/:id', (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const {firstName, lastName, email, password} = req.body;
    const user = users.find(element => {
        return element.id === id;
    });
    if (!user) {
        return res.status(404).json({
            success: false,
            message: 'User not found',
        });
    }
    if (!firstName && !lastName && !email && !password) {
        return res.status(404).json({
            success: false,
            message: 'Nothing to change',
        });
    }

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (email) user.email = email;
    if (password) user.password = password;

    return res.status(200).json({
        success: true,
        message: 'User updated',
    });
});

//Uute kasutajate lisamine
app.post('/api/v1/users', (req: Request, res: Response) => {
    //console.log(req.body);
    const {firstName, lastName, email, password} = req.body;
    if (!firstName || !lastName || !email || !password) {
        return res.status(404).json({
            success: false,
            message: 'Some data is missing (firstName, lastName, email, password)',
        });
    }
    const id = users.length + 1;
    const newUser: IUser = {
        id,
        firstName,
        lastName,
        email,
        password,
    };
    users.push(newUser);
//Tagasiside, kas kasutaja loomine õnnestus:
    res.status(201).json({
        success: true,
        message: `User with email ${newUser.id} created`,//Oluline et see oleks tagurpidi ülakomade sees!!!
    });
});

//Kasutajate kustutamine ID järgi
app.delete('/api/v1/users:id', (req: Request, res: Response) => {
    const id = parseInt( req.params.id);
    const index = users.findIndex(element => element.id === id);
    if (index === -1){
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

//Kodus teha API 4 asjaga. 
//Tunniplaanis nt: Klassiruumid/õppejõud/kuupäevad/Ained. 
//Endpoindid lugemiseks, loomiseks, kustutamiseks ja parandamiseks.