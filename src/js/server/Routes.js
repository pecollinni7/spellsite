const fs               = require('fs');
const needle           = require('needle');
const FileType         = require('file-type');
const Data             = require('../site/Data');
const StorageFilePaths = require('../site/StorageFilePaths');

const getData = () => needle.request(
	'get',
	StorageFilePaths.CHECK_FOR_UPDATES,
	{
		clientVersion: Data.version
	},
	{
		multipart: true,
		json     : true
	},
	(error, response, body) => {
		if (error)
		{
			console.log(error);
			return;
		}
		
		console.log('response statusCode = ' + response.statusCode);
		
		if (response.statusCode === 200)
		{
			console.log('new data arrived');
			
			fs.writeFile(
				StorageFilePaths.path_dataFile,
				JSON.stringify(body, null, 4),
				'utf8',
				function (err) {
					if (err)
					{
						console.log('error while writing poller response');
						throw err;
					}
					
					// files.setDataFile(files.readFileAsync(files.path_dataFile));
					Data.reloadData();
					
					//live update tags here
					//or file removal maybe
					
					// $(document).trigger("newDataArrived");
					
				});
		}
		
		if (response.statusCode === 205)
		{
			console.log('you are up to date');
		}
	}
);

function getLocalFileList()
{
	return fs.readdirSync(StorageFilePaths.path_media, {withFileTypes: true})
			 .filter(item => !item.isDirectory())
			 .map(item => item.name);
}

function getServerFileList()
{
	return Data.getAllFileNamesNoExistCheck();
}

function getFilesDifference()
{
	const fileListInDir  = getLocalFileList();
	const fileListInJson = getServerFileList();
	
	// console.log('fileListInDir: ' + fileListInDir);
	// console.log('fileListInJson: ' + fileListInJson);
	
	return fileListInJson.filter(
		x => !fileListInDir.includes(x) &&
			 x !== 'version' &&
			 x !== 'tagTypes');
}

function downloadNewFiles()
{
	const fileDiff = getFilesDifference();
	// console.log('fileDiff: ' + fileDiff);
	
	fileDiff.forEach(fileName => {
		
		downloadFile(fileName);
		
	})
}


const setData = (cb) => needle.request(
	'post',
	StorageFilePaths.SET_DATA_FILE,
	{
		jsonData: JSON.stringify(Data.patchFile)
	},
	{
		multipart: true,
		json     : true
	},
	(error, response, body) => {
		if (error)
		{
			console.log(error);
			return;
		}
		
		console.log('response statusCode = ' + response.statusCode);
		// console.log('patchFile: ' + JSON.stringify(files.getPatchFile()));
		
		if (response.statusCode === 200)
		{
			
			fs.writeFile(
				StorageFilePaths.path_dataFile,
				JSON.stringify(body, null, 2),
				'utf8',
				function (err) {
					if (err)
					{
						console.log('error while writing poller response');
						throw err;
					}
					
					Data.clearPatch();
					// files.setDataFile(files.readFileAsync(files.path_dataFile));
					cb();
				});
		}
	}
);


const uploadFile = (data) => {
	
	needle.request(
		'post',
		StorageFilePaths.UPLOAD_FILE,
		{file: data},
		{multipart: true},
		(error, response, body) => {
			if (error) console.log(error);
			console.log(body);
		}
	)
};

const uploadMedia = function (files) {
	
	for (let i = 0; i < files.length; i++)
	{
		constructUploadData(files[i])
			.then((data) => {
				
				uploadFile(data);
				
			})
			.catch((err) => {
				console.log(err);
			})
	}
};


async function constructUploadData(file)
{
	return {
		buffer      : await fs.readFileSync(file.path),
		filename    : await file.name,
		content_type: (await FileType.fromFile(file.path)).mime
	};
}


const downloadFile = (fileName) => {
	
	
	var stream = needle.get(StorageFilePaths.DOWNLOAD_MEDIA + fileName);
	var ws     = fs.createWriteStream(StorageFilePaths.path_media + '/' + fileName);
	
	stream.on('readable', function () {
		var chunk;
		while (chunk = this.read())
		{
			// console.log('got data: ', chunk);
			ws.write(chunk);
		}
	});
	
	stream.on('done', function (err) {
		if (err)
		{
			console.log(err);
			//TODO delete ws file
		}
		
		console.log('file downloaded: ' + fileName);
		
		setTimeout(() => {
			$(document).trigger("newFilesArrived");
			
		}, 1000);
		
		// console.log(this.request.res.headers['content-disposition']); //fileName from server
	})
};


module.exports = {
	setData,
	getData,
	uploadMedia,
	downloadFile,
	downloadNewFiles
};

