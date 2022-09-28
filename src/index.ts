import express, { Request, Response } from 'express';
const app = express();
const PORT = 3000;

app.use(express.json()); //Middleware
//-----------------------------------------------------------------------
//Massiivi formaadi määramine. Need on näiteks APIsse kasutajate üles laadimisel kohustuslikud väljad:
interface INewUser{
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

interface INewRoom{
    name: string;
}

interface INewLector{
    firstName: string;
    lastName: string;
    email: string;
}

interface INewLesson{
    name: string;
}

interface INewCourse{
    name: string;
}

//------------------------------------------------------------------------
//Interface ID addition
//Massiivile iNewUser'ile ID määramine. Nii tegemine laiendab teist interface'i, aga ei muuda seda vanadele kasutajatele.
interface IUser extends INewUser {
    id: number;
}

interface IRoom extends INewRoom {
    id: number;
}

interface ILector extends INewLector {
    id: number;
}

interface ILesson extends INewLesson {
    id: number;
}

interface ICourse extends INewCourse {
    id: number;
}

//--------------------------------------------------------------------------
//Massiivide esimesed andmed

//Kasutaja
const users: IUser[] = [
    {
    id: 1,
    firstName: 'Juhan',
    lastName: 'Juurikas',
    email: 'juhan@juurikas.ee',
    password: 'juhan'
    },
];

//Klassiruum
const classrooms: IRoom[] = [
    {
    id: 1,
    name: "Arvutilabor 999"
    },
];

//Õppejõud
const lectors: ILector[] = [
    {
    id: 1,
    firstName: 'Martti',
    lastName: 'Raavel',
    email: 'Na@Na.ee',
    },
];

const lessons: ILesson[] = [
    {
    id: 1,
    name: "Programmeerimine II"
    },
];

const courses: ICourse[] = [
    {
    id: 1,
    name: "RIF_2"
    },
];


//---------------------------------------------------------------------------
//API töötamise kontroll

app.get('/api/v1/health', (req: Request, res: Response) => {
    res.status(200).json({
        message: 'Hello world!',
    });
});

//---------------------------------------------------------------------------
//APIde loomise alustamine USERS jaoks

//API kasutajate listi päring
app.get('/api/v1/users', (req: Request, res: Response) => {
    res.status(200).json({
        success: true,
        message: 'List of users',
        users
    });
});

//ID järgi kasutaja küsimine
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

//Uute kasutajate lisamine
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
//Tagasiside, kas kasutaja loomine õnnestus:
    res.status(201).json({
        success: true,
        message: `User with id ${newUser.id} created`,//Oluline et see oleks tagurpidi ülakomade sees!!!
    });
});

//Kasutaja andmete muutmine
app.patch('/api/v1/users/:id', (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const { firstName, lastName, email, password } = req.body;
    const user = users.find(element => {
        return element.id === id;
    });
    if (!user) {
        return res.status(404).json({
            success: false,
            message: 'User not found',
        });
    };
    if (!firstName && !lastName && !email && !password) {
        return res.status(400).json({
            success: false,
            message: 'Nothing to change',
        });
    };
    if(firstName) user.firstName = firstName;
    if(lastName) user.lastName = lastName;
    if(email) user.email = email;
    if(password) user.password = password;
    return res.status(200).json({
        success: true,
        message: 'User updated',
    });
});

//Kasutajate kustutamine ID järgi
app.delete('/api/v1/users:id', (req: Request, res: Response) => {
    const id = parseInt( req.params.id);
    const index = users.findIndex(element => element.id === id);
    if (index === -1){
        return res.status(404).json({
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

//Kodus teha API 4 asjaga. 
//Tunniplaanis nt: Klassiruumid/õppejõud/kuupäevad/Ained. 
//Endpoindid lugemiseks, loomiseks, kustutamiseks ja parandamiseks.

//---------------------------------------------------------------------------
//APIde loomise alustamine CLASSROOMS jaoks

//Ruumide listi päring
app.get('/api/v1/classrooms', (req: Request, res: Response) => {
    res.status(200).json({
        success: true,
        message: 'List of classrooms',
        classrooms
    });
});

//Ruumide küsimine ID järgi
app.get('/api/v1/classrooms/:id', (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const classroom = classrooms.find(element => {
        return element.id === id;
    });
    if (!classroom) {
        return res.status(404).json({
            success: false,
            message: 'Classroom not found',
        });
    };
    return res.status(200).json({
        success: true,
        message: 'Classroom',
        data: {
            id: classroom.id,
            name: classroom.name
        }
    });
});

//Uute klassiruumide listi lisamine
app.post('/api/v1/classrooms', (req: Request, res: Response) => {
    const {name} = req.body;
    const id = classrooms.length + 1;
    const newRoom: IRoom = {
        id,
        name,
    };
    classrooms.push(newRoom);
//Tagasiside, kas ruumi loomine õnnestus:
    res.status(201).json({
        success: true,
        message: `Classroom ${newRoom.id} created`,//Oluline et see oleks tagurpidi ülakomade sees!!!
    });
});

//Klassiruumi muutmine ID järgi
app.patch('/api/v1/classrooms/:id', (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const { name } = req.body;
    const classroom = classrooms.find(element => {
        return element.id === id;
    });
    if (!classroom) {
        return res.status(404).json({
            success: false,
            message: 'classroom not found',
        });
    };
    if (!name) {
        return res.status(400).json({
            success: false,
            message: 'Nothing to change',
        });
    };
    if(name) classroom.name = name;
    return res.status(200).json({
        success: true,
        message: 'Classroom updated',
    });
});

//Klassiruumi kustutamine ID järgi
app.delete('/api/v1/classrooms:id', (req: Request, res: Response) => {
    const id = parseInt( req.params.id);
    const index = classrooms.findIndex(element => element.id === id);
    if (index === -1){
        return res.status(404).json({
            success: true,
            message: `Classroom not found`,
        });
    }
    classrooms.splice(index, 1);
    return res.status(200).json({
        success: true,
        message: `Classroom deleted`,
    });
});

//---------------------------------------------------------------------------
//APIde loomise alustamine LECTORS jaoks

//Õppejõudude päring
app.get('/api/v1/lectors', (req: Request, res: Response) => {
    res.status(200).json({
        success: true,
        message: 'List of lectors',
        lectors
    });
});

//Õppejõudude küsimine ID järgi
app.get('/api/v1/lectors/:id', (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const lector = lectors.find(element => {
        return element.id === id;
    });
    if (!lector) {
        return res.status(404).json({
            success: false,
            message: 'Lectors not found',
        });
    };
    return res.status(200).json({
        success: true,
        message: 'Lector',
        data: {
            id: lector.id,
            firstName: lector.firstName,
            lastName: lector.lastName,
            email: lector.email,
        }
    });
});

//Uute õppejõudude listi lisamine
app.post('/api/v1/lectors', (req: Request, res: Response) => {
    const {firstName, lastName, email} = req.body;
    const id = lectors.length + 1;
    const newLector: ILector = {
        id,
        firstName,
        lastName,
        email,
    };
    lectors.push(newLector);
//Tagasiside, kas õppejõu loomine õnnestus:
    res.status(201).json({
        success: true,
        message: `Lector ${newLector.id} created`,//Oluline et see oleks tagurpidi ülakomade sees!!!
    });
});

//Õppejõu muutmine ID järgi
app.patch('/api/v1/lectors/:id', (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const { firstName, lastName, email } = req.body;
    const lector = lectors.find(element => {
        return element.id === id;
    });
    if (!lector) {
        return res.status(404).json({
            success: false,
            message: 'Lector not found',
        });
    };
    if (!firstName && !lastName && !email) {
        return res.status(400).json({
            success: false,
            message: 'Nothing to change',
        });
    };
    if(firstName) lector.firstName = firstName;
    if(lastName) lector.lastName = lastName;
    if(email) lector.email = email;
    return res.status(200).json({
        success: true,
        message: 'Lector updated',
    });
});

//Õppejõu kustutamine ID järgi
app.delete('/api/v1/lectors:id', (req: Request, res: Response) => {
    const id = parseInt( req.params.id);
    const index = lectors.findIndex(element => element.id === id);
    if (index === -1){
        return res.status(404).json({
            success: true,
            message: `Lectors not found`,
        });
    }
    lectors.splice(index, 1);
    return res.status(200).json({
        success: true,
        message: `Lector deleted`,
    });
});

//---------------------------------------------------------------------------
//APIde loomise alustamine LESSONS jaoks

//Ainete listi päring
app.get('/api/v1/lessons', (req: Request, res: Response) => {
    res.status(200).json({
        success: true,
        message: 'List of lessons',
        lessons
    });
});

//Ainete küsimine ID järgi
app.get('/api/v1/lessons/:id', (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const lesson = lessons.find(element => {
        return element.id === id;
    });
    if (!lesson) {
        return res.status(404).json({
            success: false,
            message: 'Lesson not found',
        });
    };
    return res.status(200).json({
        success: true,
        message: 'Lesson',
        data: {
            id: lesson.id,
            name: lesson.name
        }
    });
});

//Uute ainete listi lisamine
app.post('/api/v1/lessons', (req: Request, res: Response) => {
    const {name} = req.body;
    const id = lessons.length + 1;
    const newLesson: ILesson = {
        id,
        name,
    };
    lessons.push(newLesson);
//Tagasiside, kas aine loomine õnnestus:
    res.status(201).json({
        success: true,
        message: `Lesson ${newLesson.id} created`,//Oluline et see oleks tagurpidi ülakomade sees!!!
    });
});

//Aine muutmine ID järgi
app.patch('/api/v1/lessons/:id', (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const { name } = req.body;
    const lesson = lessons.find(element => {
        return element.id === id;
    });
    if (!lesson) {
        return res.status(404).json({
            success: false,
            message: 'Lesson not found',
        });
    };
    if (!name) {
        return res.status(400).json({
            success: false,
            message: 'Nothing to change',
        });
    };
    if(name) lesson.name = name;
    return res.status(200).json({
        success: true,
        message: 'Lesson updated',
    });
});

//Aine kustutamine ID järgi
app.delete('/api/v1/lessons:id', (req: Request, res: Response) => {
    const id = parseInt( req.params.id);
    const index = lessons.findIndex(element => element.id === id);
    if (index === -1){
        return res.status(404).json({
            success: true,
            message: `Lesson not found`,
        });
    }
    lessons.splice(index, 1);
    return res.status(200).json({
        success: true,
        message: `Lesson deleted`,
    });
});

//---------------------------------------------------------------------------
//APIde loomise alustamine COURSES jaoks

//Kursuse listi päring
app.get('/api/v1/courses', (req: Request, res: Response) => {
    res.status(200).json({
        success: true,
        message: 'List of courses',
        courses
    });
});

//Kursuste küsimine ID järgi
app.get('/api/v1/courses/:id', (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const course = courses.find(element => {
        return element.id === id;
    });
    if (!course) {
        return res.status(404).json({
            success: false,
            message: 'Course not found',
        });
    };
    return res.status(200).json({
        success: true,
        message: 'Course',
        data: {
            id: course.id,
            name: course.name
        }
    });
});

//Uute kursuste listi lisamine
app.post('/api/v1/courses', (req: Request, res: Response) => {
    const {name} = req.body;
    const id = courses.length + 1;
    const newCourse: ICourse = {
        id,
        name,
    };
    courses.push(newCourse);
//Tagasiside, kas kursuse loomine õnnestus:
    res.status(201).json({
        success: true,
        message: `Course ${newCourse.id} created`,//Oluline et see oleks tagurpidi ülakomade sees!!!
    });
});

//Kursuse muutmine ID järgi
app.patch('/api/v1/courses/:id', (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const { name } = req.body;
    const course = courses.find(element => {
        return element.id === id;
    });
    if (!course) {
        return res.status(404).json({
            success: false,
            message: 'Course not found',
        });
    };
    if (!name) {
        return res.status(400).json({
            success: false,
            message: 'Nothing to change',
        });
    };
    if(name) course.name = name;
    return res.status(200).json({
        success: true,
        message: 'Course updated',
    });
});

//Kursuse kustutamine ID järgi
app.delete('/api/v1/courses:id', (req: Request, res: Response) => {
    const id = parseInt( req.params.id);
    const index = courses.findIndex(element => element.id === id);
    if (index === -1){
        return res.status(404).json({
            success: true,
            message: `Course not found`,
        });
    }
    courses.splice(index, 1);
    return res.status(200).json({
        success: true,
        message: `Course deleted`,
    });
});

//Kodutöö lõpp

app.listen(PORT, () => {
    console.log('Server is running');
});
