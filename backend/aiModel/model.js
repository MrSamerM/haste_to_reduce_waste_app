const tf = require('@tensorflow/tfjs-node');
const fs = require('fs');//This handles file systems

// For some images in NotContainer I used images from kaggle using data from the dataset from:
// https://www.kaggle.com/datasets/utkarshsaxenadn/landscape-recognition-image-dataset-12k-images/data Use kaggle for scenary
// https://www.kaggle.com/datasets/vikashrajluhaniwal/fashion-images Use kaggle for clothes and shoes
// https://www.kaggle.com/datasets/vencerlanz09/plastic-and-paper-cups-synthetic-image-dataset use kaggle for cups
// https://www.kaggle.com/datasets/boulahchichenadir/algerian-used-cars use kaggle for vehicles

const imageHeight = 224;
const imageWidth = 224;
const classes = 2;

const containerDir = '../aiDataset/Train/Container';
const notContainerDir = '../aiDataset/Train/NotContainer';

const containerFiles = fs.readdirSync(containerDir);
const notContainerFiles = fs.readdirSync(notContainerDir);

const imageArray = [];
const labelsArray = [];

// This is to load the data

// Used for reference:
// https://dev.to/atordvairn/training-an-image-model-with-tenserflow-in-nodejs-18em
// https://medium.com/analytics-vidhya/classification-model-on-custom-dataset-using-tensorflow-js-9458da5f2301 


containerFiles.forEach((file) => {
    const eachFile = `${containerDir}/${file}`;//each file is Container(n).jpg
    const readFile = fs.readFileSync(eachFile)
    const decodedImage = tf.node.decodeImage(readFile);//Then decode
    const resizedImage = tf.image.resizeBilinear(decodedImage, [imageWidth, imageHeight]);//Resize each file
    imageArray.push(resizedImage);
    labelsArray.push(0);//Container label is 0
})

notContainerFiles.forEach((file) => {
    const eachFile = `${notContainerFiles}/${file}`;
    const readFile = fs.readFileSync(eachFile)
    const decodedImage = tf.node.decodeImage(readFile);//Then decode
    const resizedImage = tf.image.resizeBilinear(decodedImage, [imageWidth, imageHeight]);//Resize each file
    imageArray.push(resizedImage);
    labelsArray.push(1);//NotContainer label is 1
})

console.log(imageArray);
console.log(labelsArray);

const model = tf.sequential();//creates a model where one output of one layer is the input of the next.

// model.add(tf.layers.conv2d({

// }))

