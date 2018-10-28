


const mapToObject = (map) => {
  const obj = {};
  for(let prop of map){
    obj[prop[0]] = prop[1];
  }
  return obj;
}

const objectToMap = (obj) =>{
  return new Map(Object.entries(obj))
}

export {
  mapToObject,
  objectToMap
}
