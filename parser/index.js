const fs = require('fs');
const dictionary = [];
const writeStream = fs.createWriteStream('output.txt');


function buildDictionary() {
    return new Promise((resolve,reject) => {
        fs.createReadStream('./numbers.txt')
            .on('data' , (data) => {
                let singleNumber = 0;
                let lineNumbers = 0;
                data = data.toString().split('\n');
                while(lineNumbers < 10) {

                 if(lineNumbers === 9) {
                     data[0] += data[0] + ' ';
                 }

                 let number = data[0].split('').splice(singleNumber ,3).join('') + '\n' + data[1].split('').splice(singleNumber,3).join('') + '\n' + data[2].split('').splice(singleNumber,3).join('');
                 dictionary.push({
                    value : lineNumbers,
                    string : number
                 });
                 singleNumber +=3;
                 lineNumbers++;
            }

            })
            .on('end', () => {

                resolve()
            })
            .on('error', (e) => {
                reject(e)
            })
    })
}
buildDictionary()
    .then(() => {
        fs.createReadStream('../task2/input2.txt')
            .on('data', (data) => {
                writeStream.write(detectNumbersLine(data.toString()))
            });

        function detectNumbersLine(numbers) {

            const separatedNumber = numbers.split('\n');
            let sliceBegin = 0;
            let sliceEnd = 3;
            let result = '';
            while(separatedNumber.length > sliceBegin) {

                result += typeof detectSingleNumber(separatedNumber.slice(sliceBegin, sliceEnd)) === 'undefined' ?
                            '' : detectSingleNumber(separatedNumber.slice(sliceBegin, sliceEnd));
                sliceBegin +=4;
                sliceEnd +=4;

            }

            return result

        }
    });



function detectSingleNumber(data) {

    let lineNumbers = 0;
    let singleNumber = 0;
    let resultLine = '';
    if(data.length > 2) {
        while(lineNumbers < 9) {

            let number = data[0].split('').splice(singleNumber ,3).join('') + '\n' + data[1].split('').splice(singleNumber,3).join('') + '\n' + data[2].split('').splice(singleNumber,3).join('');
            resultLine += transformSingleNumber(number);

            lineNumbers ++;
            singleNumber +=3;
        }

        if(resultLine.match(/\?/g)) {
            resultLine += ' ILLEGAL';
        }
            return `${resultLine}\n`

    }



}

function transformSingleNumber(number) {
    let result = null;

    dictionary.forEach((e) => {
       if(e.string === number) {
           result = e.value
       }
    });

    if(result === null) {
        return '?'
    } else {
        return result
    }
}
