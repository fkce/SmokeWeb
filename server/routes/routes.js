const exec = require('child_process').exec;
const dirTree = require('directory-tree');


module.exports = function(app){

	const tree = dirTree("/mnt/shared", { extensions: /\.smv/ });

	// Main route
	app.get('/api/test', (req, res) => {

		result = {
			meta: {
				status: 'success',
				from: 'test',
				details: ['some info']
			},
			data: tree
		}
		res.send(result)
		//exec('pwd', (err, stdout, stderr) => {
		//	console.log(stdout)
		//	res.send(stdout)
		//})
	})

	// Main route
	app.get('/api/getDirectories', (req, res) => {
		exec('pwd', (err, stdout, stderr) => {
			console.log(stdout)
			res.send(stdout)
		})
	})

	// Other routes ...

}
