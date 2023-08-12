import axios from 'axios';
import tf from '@tensorflow/tfjs-node';
import nsfw from 'nsfwjs';

export default async function nsfwClient(url) {
  try {
  const pic = await axios.get(url, {
    responseType: 'arraybuffer',
  });

  const model = await nsfw.load(); // To load a local model, nsfw.load('file://./path/to/model/')

  // Image must be in tf.tensor3d format
  // You can convert the image to tf.tensor3d with tf.node.decodeImage(Uint8Array, channels)
  const image = await tf.node.decodeImage(pic.data, 3);
  const predictions = await model.classify(image);


  // Sort predictions by probability in descending order
  predictions.sort((a, b) => b.probability - a.probability);

  
  const highestPrediction = predictions[0];
  const secondHighestPrediction = predictions[1];
  const highestClass = highestPrediction.className;
  const secondHighestClass = secondHighestPrediction.className;
  var isSafe = false;

  if (highestClass === 'Porn' && secondHighestClass === 'Sexy' || highestClass === 'Porn' && secondHighestClass === 'Hentai' || highestClass === 'Porn' && secondHighestClass === 'Drawing') {
    isSafe = false;
  } 
      else if (highestClass === 'Sexy' && secondHighestClass === 'Porn' || highestClass === 'Sexy' && secondHighestClass === 'Hentai' || highestClass === 'Sexy' && secondHighestClass === 'Drawing') {
    isSafe = false;
  }
    else if (highestClass === 'Hentai' && secondHighestClass === 'Porn' || highestClass === 'Hentai' && secondHighestClass === 'Sexy' || highestClass === 'Hentai' && secondHighestClass === 'Drawing' ) {
    isSafe = false;
  }
  else if (highestClass === 'Drawing' && secondHighestClass === 'Porn' || highestClass === 'Drawing' && secondHighestClass === 'Hentai' ||  highestClass === 'Drawing' && secondHighestClass === 'Sexy') {
    isSafe = false;
  }
  else
  {
    isSafe = true;
  }


  image.dispose();

  return [false, isSafe, predictions];
  }
  catch (error) {
    console.log(error)
    return [true];
    }
  
}
