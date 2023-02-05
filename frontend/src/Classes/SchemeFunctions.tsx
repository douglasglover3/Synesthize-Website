import defaultSchemes from '../schemes/defaultSchemes'; 

const isDefaultScheme = (schemeName) => {
    let ret = false;
    defaultSchemes.forEach((scheme) => {
        if (schemeName === scheme.name) 
            ret = true;
    });

    return ret;
}

export { isDefaultScheme };