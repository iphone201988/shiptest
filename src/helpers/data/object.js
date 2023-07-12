
export const getNestedProp = (obj, path) => (
    // ex: path = "a.b.c"  => obj.a.b.c
    path.split('.').reduce((acc, part) => acc && acc[part], obj)
);