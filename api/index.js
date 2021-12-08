import fetch from 'node-fetch';


function chunk(array, size) {
    const chunked = [];

    for (let element of array){
        const last = chunked[chunked.length-1]

        if(!last || last.length === size){
            chunked.push([element])
        }else{
            last.push(element)
        }
    }
    return chunked;
}


const retrieve = async ({ page, colors }) => {
    let limit = page * 10;
    let queryStringColors = ``
    for (let color of colors){
        queryStringColors += `&color[]=${color}`
    }
    const res = await fetch(`http://localhost:3000/records?limit=${limit}&offset=10${queryStringColors}`)
    const result = await res.json()
    const chunked = chunk(result, 10)
    const paginatedResult = chunked[chunked.length - 1]
    let finalObject = {id: [], open: [], closedPrimaryCount: 0, previousPage: null, nextPage: null};
    paginatedResult.map((item) => {
       finalObject.id.push(item.id)
       if (item.disposition === "open" && item.color == "red" || item.color == "blue" || item.color == "blue" ){
            finalObject.open.push({
                disposition: "open",
                color: item.color,
                isPrimary: true,
                id: item.id
                
            })
        }
        if(item.disposition === "closed"){
            finalObject.closedPrimaryCount++;
        }
        if(page !== 1) { finalObject.previousPage = page -1}
        if(page !== 50) { finalObject.nextPage = page + 1}
   })
   console.log("---OUR FINAL OBJECT LOGGED IS SHOWN HERE----")
   console.log(finalObject);
   console.log("---OUR FINAL OBJECT LOGGED IS SHOWN HERE----")
   return finalObject
}


Promise.all([retrieve({ page: 2, colors: ["red", "brown"] })]).then((values) => {
    console.log("-----OUR PROMISE RESULT VALUE IS SHOWN HERE-----")
    console.log(values);
    console.log("-----OUR PROMISE RESULT VALUE IS SHOWN HERE-----")
  });


//export default retrieve;
