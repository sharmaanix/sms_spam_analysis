//acquiring file system
var fs = require('fs');
//acquiring readline
var readline = require('readline');
var input = require('readline-sync');

//loading data
var instream = fs.createReadStream('english_big.txt');

// Load Naive Bayes Text Classifier
var Classifier = require( 'wink-naive-bayes-text-classifier' );
// Instantiate
var nbc = Classifier();
// Load NLP utilities
var nlp = require( 'wink-nlp-utils' );
// Configure preparation tasks
nbc.definePrepTasks( [
  // Simple tokenizer
  nlp.string.tokenize0,
  // Common Stop Words Remover
  nlp.tokens.removeWords,
  // Stemmer to obtain base word
  nlp.tokens.stem
] );
// Configure behavior
nbc.defineConfig( { considerOnlyPresence: true, smoothingFactor: 1 } );


//creating the readline interface
var rl = readline.createInterface(
{
    input: instream,
    terminal: false
});

//addline with index and initialize 
 var sentence=[];
 var sentence_array=[];
rl.on('line', function(line) {

	 sentence = line.split(",").map(function (val) { return val; });
	 sentence_array.push(sentence);

});

rl.on('close',function()
{
	for(key in sentence_array)
	{
		var i=sentence_array[key].length;
		var j=0;
		while(j<(i-1))
		{
			nbc.learn(sentence_array[key][j],sentence_array[key][i-1]);
			//console.log(sentence_array[key][j]+'\t'+sentence_array[key][i-1]);
			j++;
		}

	}
	console.log("learning data completed");
	//Consolidate all the training!!
	nbc.consolidate();
	// Start predicting...
	var prediction = input.question("Enter SMS to predict spam");
	var spam =nbc.predict(prediction);
	if (spam=='spam')
	{
		console.log('the following text or SMS you enter is a spam');
	}
	else
	{
		console.log("the following text or SMS is not a spam");
	}
});


