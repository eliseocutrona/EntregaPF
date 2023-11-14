interface NavItem{
    path: string;
    title: string;
    icon?: string;
}

const links: NavItem[] = [{
    path: 'alumnos',
    title: 'Alumnos',
    icon: 'school', 
},
{
    path: 'cursos',
    title: 'Cursos',
    icon: 'history_edu',
},
{
    path: 'inscripciones',
    title: 'Inscripciones',
    icon: 'assignment_ind',
},
{
    path: 'usuarios',
    title: 'Usuarios',
    icon: 'person', 
}]

export default links;