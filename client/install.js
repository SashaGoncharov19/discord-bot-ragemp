const fs = require('fs');
const rd = require('readline');
const file = rd.createInterface({
	input: process.stdin, 
	output: process.stdout
});

file.question('Server IP: ', (answer) => {
	file.question('Server port: ' , (answer2) => {
		file.question('Server platform: ', (answer3) => {
			file.question('Time to change status: (in minutes) ', (answer4) => {
				file.question('Bot token: ', (answer5) => {
					let config = {
					"ip": answer, 
					"port": answer2, 
					"platform": answer3, 
					"time": answer4, 
					"token": answer5
				};
				let data = JSON.stringify(config);
					fs.writeFileSync('config.json', data);
					fs.writeFileSync("start.bat", "node client.js");
					fs.unlinkSync("install.bat");
					fs.unlinkSync("install.js");
				})
			})
		})
	})
});