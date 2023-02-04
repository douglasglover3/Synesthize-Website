type Scheme = {
    name: string,
    notes: string[]
}

let mosaic = {"name":"Mosaic","notes":["#fd3535","#df60e1","#9b3dae","#4c30d9","#48c8fe","#28a46a","#5f983a","#ffe32e","#a97214","#ff6600","#8e2929","#e46262"]};
let summer = {"name":"Summer","notes":["#fff94d","#ff830f","#fb4646","#ffa82e","#fff9b8","#a32900","#feec2a","#fe5d75","#ffc800","#ff0000","#fe9a9a","#d3c56f"]};
let natural = {"name":"Natural","notes":["#3fe486","#077000","#0eb958","#758500","#bec748","#4c907b","#0cad00","#7cbbfe","#a5ff38","#e7ff70","#bed798","#227000"]};
let sunset = {"name":"Sunset","notes":["#fe62cd","#ff8ab3","#8c00ff","#fb9379","#75005c","#f1dfec","#754d70","#6d6595","#af4623","#a34d4d","#b4316a","#9000a3"]};
let oceanic = {"name":"Oceanic","notes":["#5a2dd7","#c790fe","#0083a3","#9fe6fe","#4b549b","#009dff","#00856a","#62fcfe","#324062","#091d6c","#89beae","#6dfdd2"]};

let defaultSchemes: Scheme[] = [];
defaultSchemes.push(mosaic);
defaultSchemes.push(summer);
defaultSchemes.push(natural);
defaultSchemes.push(sunset);
defaultSchemes.push(oceanic);

export default defaultSchemes;