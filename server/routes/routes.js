const exec = require('child_process').exec;
const dirTree = require("directory-tree");
const glob = require('glob');

module.exports = function(app){

	// Get directories structure
	app.get('/getDirectories', (req, res) => {
		// Get tree
		const tree = dirTree(global.gConfig.resultsPath, { extensions: /\.(smv|fds)$/ });
		// Create result answer
		result = {
			meta: {
				status: 'success',
				from: 'getDirectories()',
				details: ['Directories structure downloaded']
			},
			data: tree
		}
		// Send request
		res.send(result)
	});

	// Get simulation geometry
	app.get('/getSimGeometry/:path(*).smv', (req, res) => {

		// Get path and chid
		let match = req.params.path.match(/(.*\/)(.*)/);
		let path = match[1];
		let chid = match[2];
		let fdsPath = '';
		let fdsFile = '';

		glob(path + '*.fds', {}, (err, files)=>{
			// Find fds file
			fdsPath = files[0];

			// Read fds file
			const fs = require('fs');

			fs.readFile(fdsPath, {encoding: 'utf-8'}, function(err, file){

				if (err) {
					if (err.code === 'ENOENT') {
						console.error('File does not exist!');
						return;
					}
					throw err;
				}

				fdsFile = file;
				
				// Create result answer
				result = {
					meta: {
						status: 'success',
						from: 'getDirectories()',
						details: ['Directories structure downloaded']
					},
					data: fdsFile
				}
				// Send request
				res.send(result)
			});
		});
	});


	// Main route
	//app.get('/api/getDirectories', (req, res) => {
	//	exec('pwd', (err, stdout, stderr) => {
	//		console.log(stdout)
	//		res.send(stdout)
	//	})
	//})

	// Other routes ...

}
