// @ts-ignore
const FFT = require('fft.js');

interface XYdata {
    x: number[];
    y: number[];
}

interface frequencyData {
    frequency: number[],
    slope: number[],
}

export class Fourier {

    //sampleRate is rate that microphone collects samples in Hz
    public sampleRate: number = 96000;

    //How loud input must be to be analyzed
    public minimumAmplitude: number = 0.002;

    //Highest amplitude detected in current input array
    topAmplitude: number = 1;

    //Output frequency range goes from 0 to input array size * timeConstant / 2 (nyquist frequency)
    public createSampleData(arraySize: number, frequency: number) {
        let xArray: number[] = []
        let yArray: number[] = []
        for (let i = 0; i < arraySize; i++)
        {
            //x array is time and y array is amplitude
            xArray.push(i)
            //creates a sin wave of above frequency
            yArray.push(Math.sin(i * Math.PI * 2 * frequency / this.sampleRate))
        }
        return({
            x: xArray,
            y: yArray
        })
    }

    public normalizeData(data: Int8Array) {
        let xArray: number[] = []
        let yArray: number[] = []
        this.topAmplitude = 0
        for (let i = 0; i < data.length; i++)
        {
            //x array is time and y array is amplitude
            xArray.push(i)
            yArray.push(data[i])
            if (data[i] > this.topAmplitude)
                this.topAmplitude = data[i]
        }
        return({
            x: xArray,
            y: yArray
        })
    }

    private padData(data: XYdata)
    {
        // gets the exponent of the next highest power of two array size
        let exponent: number = Math.ceil(Math.log(data.x.length) / Math.LN2)
        // data must be in array with length of a power of two 
        let nextPowerOfTwo: number = Math.pow(2, exponent)
        
        //create array with index values counting up to new size to fill x array
        let xValues: number[] = [...Array(nextPowerOfTwo - data.x.length).keys()].map(x => x + data.x.length)

        //create array with zeroes to fill y array to new size
        let zeroes: number[] = new Array(nextPowerOfTwo - data.x.length).fill(0)
        return {
            x: data.x.concat(xValues),
            y: data.y.concat(zeroes)
        }
    }

    public applyTransform(data: XYdata)
    {
        //pads data to appropriate size of a power of two
        let paddedData: XYdata = this.padData(data)

        //creates a fourier transform
        const f = new FFT(paddedData.x.length);
        let out = f.createComplexArray(paddedData.y);
        f.realTransform(out, paddedData.y);

        //adjusts data to appropriate frequency range
        const xRange: number[] = this.adjustXRange(paddedData.x, data.x.length)

        return({
            x: xRange,
            y: out
        })
    }

    private adjustXRange(arr: number[], originalSize) {
        
        for (let i in arr) {
            //Adjusts array values to account for size before padding
            arr[i] = arr[i] * (originalSize / arr.length)
            //Adjusts array values to account for sample rate
            arr[i] = arr[i] * (this.sampleRate / arr.length) / 4; 
        }
        //cuts down array to appropriate time frame
        return arr.slice(0, arr.length)
    }

    //gets top frequencies detected within fourier transform
    //quantity determines how many frequencies to find
    public getFrequencies(fourierData: XYdata, quantity: number) {

        let frequencyArray: frequencyData = {
            frequency: new Array(quantity).fill(0),
            slope: new Array(quantity).fill(0),
        }

        //returns nothing if too quiet
        if(this.topAmplitude < this.minimumAmplitude)
        {
            return []
        }

        //Idea is to identify peaks by largest slopes in the graph
        //Cycles through fourier transform x-values
        for (let i = 1; i < fourierData.x.length; i++) 
        {
            //finds slope between current x and adjacent x
            let slope: number = Math.abs(fourierData.y[i] - fourierData.y[i - 1])

            //Cycles through found slopes
            for(let j in frequencyArray.slope)
                //if a larger slope is detected, add its frequency to frequency array
                if (slope > frequencyArray.slope[j])
                {
                    //average of x values sharing slope
                    frequencyArray.frequency[j] = (fourierData.x[i] + fourierData.x[i - 1]) / 2
                    frequencyArray.slope[j] = slope
                    break;
                }
        }
        return frequencyArray.frequency;
    }
}