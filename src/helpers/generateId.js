const generateId = () => {
    //para darle un id unico combino el numero del datenow con mathrandom(sacandole los dos primeros digitos que son 0.0)
    return Date.now().toString(32) + Math.random().toString(32).substring(2);
};

export  default generateId;